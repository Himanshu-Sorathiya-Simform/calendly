import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users } from "@/db/schema";

export async function POST(req: Request) {
	const WEBHOOK_SECRET = process.env["WEBHOOK_SECRET"];

	if (!WEBHOOK_SECRET) {
		throw new Error(
			"Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local",
		);
	}

	const headerPayload = await headers();
	const svix_id = headerPayload.get("svix-id");
	const svix_timestamp = headerPayload.get("svix-timestamp");
	const svix_signature = headerPayload.get("svix-signature");

	if (!svix_id || !svix_timestamp || !svix_signature) {
		return new Response("Error occured -- no svix headers", {
			status: 400,
		});
	}

	const payload = await req.json();
	const body = JSON.stringify(payload);

	const wh = new Webhook(WEBHOOK_SECRET);
	let evt: WebhookEvent;

	try {
		evt = wh.verify(body, {
			"svix-id": svix_id,
			"svix-timestamp": svix_timestamp,
			"svix-signature": svix_signature,
		}) as WebhookEvent;
	} catch (err) {
		console.error("Error verifying webhook:", err);
		return new Response("Error occured", {
			status: 400,
		});
	}

	const eventType = evt.type;

	if (eventType === "user.created" || eventType === "user.updated") {
		const { id, email_addresses, first_name, last_name, username } = evt.data;
		if (!id) {
			return new Response("No id provided", { status: 400 });
		}

		const email = email_addresses[0]?.email_address;
		if (!email) {
			return new Response("No email address provided", { status: 400 });
		}

		const name = `${first_name || ""} ${last_name || ""}`.trim() || "No Name";

		// To get the Google Refresh Token, you typically need to fetch it via the Clerk API
		// However, if we pass it through private_metadata during sign up or webhooks, we can catch it.
		// For native Google integration, the token is often stored in the user's external_accounts.

		// Note: Clerk only sends tokens if specifically configured to do so in the webhook or via their API directly.
		// We might need to fetch the token from Clerk's API in a real scenario.
		// We will leave the column null here unless it's explicitly provided.

		const finalId = String(id);
		const finalEmail = String(email);
		const finalName = String(name);
		const finalUsername = username ? String(username) : finalEmail.split("@")[0];
		const finalToken = null;

		try {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const newUserData: any = {
				id: finalId,
				email: finalEmail,
				name: finalName,
				username: finalUsername,
				googleRefreshToken: finalToken,
			};

			await db.insert(users).values(newUserData).onConflictDoUpdate({
				target: users.id,
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				set: newUserData,
			});
			console.log(`User ${finalId} upserted successfully`);
		} catch (error) {
			console.error("Error upserting user:", error);
			return new Response("Database error", { status: 500 });
		}
	}

	return new Response("", { status: 200 });
}
