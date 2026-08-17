"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "../../db";
import { bookings, eventTypes, users } from "../../db/schema";
import { toDate } from "@himanshu-sorathiya/datetime";
import { createCalendarEvent } from "../../utils/googleCalendarUtils";

type FormState = {
	status: "idle" | "success" | "error";
	message: string;
};

export async function createBooking(
	_prevState: FormState,
	formData: FormData,
): Promise<FormState> {
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

		const startTime = toDate(startTimeStr);
		const endTime = toDate(endTimeStr);

		const [eventWithUser] = await db
			.select({
				shortId: eventTypes.shortId,
				title: eventTypes.title,
				googleRefreshToken: users.googleRefreshToken,
			})
			.from(eventTypes)
			.innerJoin(users, eq(eventTypes.userId, users.id))
			.where(eq(eventTypes.id, eventTypeId))
			.limit(1);

		if (!eventWithUser) {
			return { status: "error", message: "Event type not found." };
		}

		// Save booking to our DB
		await db.insert(bookings).values({
			eventTypeId,
			guestName: name,
			guestEmail: email,
			startTime,
			endTime,
		});

		// Sync with Google Calendar if host is connected
		if (eventWithUser.googleRefreshToken) {
			try {
				await createCalendarEvent(eventWithUser.googleRefreshToken, {
					summary: `${eventWithUser.title} with ${name}`,
					startTime,
					endTime,
					attendeeEmail: email,
				});
			} catch (gcalError) {
				console.error("Failed to sync with Google Calendar:", gcalError);
				// We don't fail the entire booking if Google sync fails, but we log it.
			}
		}

		revalidatePath(`/book/${eventWithUser.shortId}`);
		redirectPath = `/book/${eventWithUser.shortId}/success`;
	} catch (error) {
		console.error("Booking error:", error);
		return { status: "error", message: "Failed to create booking." };
	}

	if (redirectPath) {
		redirect(redirectPath);
	}

	return { status: "error", message: "Failed to redirect" };
}
