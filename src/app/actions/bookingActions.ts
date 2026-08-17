"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "../../db";
import { bookings, eventTypes, users } from "../../db/schema";

type FormState = {
	status: "idle" | "success" | "error";
	message: string;
};

export async function createBooking(_prevState: FormState, formData: FormData): Promise<FormState> {
	let redirectPath = "";

	try {
		const eventTypeId = Number(formData.get("eventTypeId"));
		const startTimeStr = formData.get("startTime") as string;
		const endTimeStr = formData.get("endTime") as string;
		const name = formData.get("name") as string;
		const email = formData.get("email") as string;

		if (!eventTypeId || !startTimeStr || !endTimeStr || !name || !email) {
			return { status: "error", message: "Missing required fields." };
		}

		const startTime = new Date(startTimeStr);
		const endTime = new Date(endTimeStr);

		const [eventWithUser] = await db
			.select({ slug: eventTypes.slug, username: users.username })
			.from(eventTypes)
			.innerJoin(users, eq(eventTypes.userId, users.id))
			.where(eq(eventTypes.id, eventTypeId))
			.limit(1);

		if (!eventWithUser) {
			return { status: "error", message: "Event type not found." };
		}

		await db.insert(bookings).values({
			eventTypeId,
			guestName: name,
			guestEmail: email,
			startTime,
			endTime,
		});

		revalidatePath(`/${eventWithUser.username}/${eventWithUser.slug}`);
		redirectPath = `/${eventWithUser.username}/${eventWithUser.slug}/success`;
	} catch (error) {
		console.error("Booking error:", error);
		return { status: "error", message: "Failed to create booking." };
	}

	if (redirectPath) {
		redirect(redirectPath);
	}

	return { status: "error", message: "Failed to redirect" };
}
