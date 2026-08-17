"use server";

import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "../../db";
import { availability, users } from "../../db/schema";

export async function updateAvailability(formData: FormData) {
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
		// First, clear all existing availability for this user
		await db.delete(availability).where(eq(availability.userId, user.id));

		// Now, parse the form data and insert the new availability rules
		// We expect form fields like: day_1_enabled: "on", day_1_start: "09:00", day_1_end: "17:00"
		
		const inserts = [];
		for (let day = 0; day <= 6; day++) {
			const isEnabled = formData.get(`day_${day}_enabled`) === "on";
			if (isEnabled) {
				const startTime = formData.get(`day_${day}_start`) as string;
				const endTime = formData.get(`day_${day}_end`) as string;
				
				if (startTime && endTime) {
					inserts.push({
						userId: user.id,
						dayOfWeek: day,
						startTime: `${startTime}:00`,
						endTime: `${endTime}:00`,
					});
				}
			}
		}

		if (inserts.length > 0) {
			await db.insert(availability).values(inserts);
		}

		revalidatePath("/availability");
		return { status: "success", message: "Availability updated successfully" };
	} catch (error) {
		console.error("Error updating availability:", error);
		return { status: "error", message: "Failed to update availability" };
	}
}
