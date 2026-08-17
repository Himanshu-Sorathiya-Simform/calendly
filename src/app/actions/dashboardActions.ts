"use server";

import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "../../db";
import { eventTypes, users } from "../../db/schema";

// Generate a random 6-character alphanumeric string for the short ID
function generateShortId() {
	const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let result = "";
	for (let i = 0; i < 6; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
}

export async function createBookingLink(formData: FormData) {
	const { userId: clerkUserId } = await auth();

	if (!clerkUserId) {
		return { status: "error", message: "Unauthorized" };
	}

	const user = await db.query.users.findFirst({
		where: eq(users.id, clerkUserId),
	});

	if (!user) {
		return { status: "error", message: "User not found" };
	}

	const title = formData.get("title") as string;
	const durationStr = formData.get("duration") as string;
	const description = formData.get("description") as string;

	if (!title || !durationStr) {
		return { status: "error", message: "Missing required fields" };
	}

	const duration = parseInt(durationStr, 10);
	if (isNaN(duration) || duration <= 0) {
		return { status: "error", message: "Invalid duration" };
	}

	try {
		const shortId = generateShortId();
		
		// In a production app, we would verify shortId uniqueness against the database here
		// before inserting to handle collisions.
		
		await db.insert(eventTypes).values({
			userId: user.id,
			title,
			duration,
			description: description || null,
			shortId,
		});

		revalidatePath("/");
		return { status: "success", message: "Booking link created successfully" };
	} catch (error) {
		console.error("Error creating booking link:", error);
		return { status: "error", message: "Failed to create booking link" };
	}
}

export async function updateBookingLink(id: number, formData: FormData) {
	const { userId: clerkUserId } = await auth();

	if (!clerkUserId) {
		return { status: "error", message: "Unauthorized" };
	}

	const user = await db.query.users.findFirst({
		where: eq(users.id, clerkUserId),
	});

	if (!user) {
		return { status: "error", message: "User not found" };
	}

	const title = formData.get("title") as string;
	const durationStr = formData.get("duration") as string;
	const description = formData.get("description") as string;

	if (!title || !durationStr) {
		return { status: "error", message: "Missing required fields" };
	}

	const duration = parseInt(durationStr, 10);
	if (isNaN(duration) || duration <= 0) {
		return { status: "error", message: "Invalid duration" };
	}

	try {
		await db.update(eventTypes)
			.set({
				title,
				duration,
				description: description || null,
			})
			.where(eq(eventTypes.id, id));

		revalidatePath("/");
		return { status: "success", message: "Booking link updated successfully" };
	} catch (error) {
		console.error("Error updating booking link:", error);
		return { status: "error", message: "Failed to update booking link" };
	}
}

export async function deleteBookingLink(id: number) {
	const { userId: clerkUserId } = await auth();

	if (!clerkUserId) {
		return { status: "error", message: "Unauthorized" };
	}

	const user = await db.query.users.findFirst({
		where: eq(users.id, clerkUserId),
	});

	if (!user) {
		return { status: "error", message: "User not found" };
	}

	try {
		await db.delete(eventTypes).where(eq(eventTypes.id, id));
		revalidatePath("/");
		return { status: "success", message: "Booking link deleted successfully" };
	} catch (error) {
		console.error("Error deleting booking link:", error);
		return { status: "error", message: "Failed to delete booking link" };
	}
}
