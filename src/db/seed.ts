import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { addDays, addMinutes, set } from "@himanshu-sorathiya/datetime";
import { db } from "./index";
import { availability, bookings, eventTypes, users } from "./schema";

async function seed() {
	console.log("Seeding database...");

	const [user] = await db
		.insert(users)
		.values({
			email: "demo@calendly-clone.com",
			name: "Demo User",
			username: "demo",
			timezone: "America/New_York",
		})
		.returning();

	if (!user) throw new Error("Failed to create user");

	console.log("Created user:", user.email);

	// 2. Seed Event Types
	const [eventType1, eventType2] = await db
		.insert(eventTypes)
		.values([
			{
				userId: user.id,
				title: "15 Min Meeting",
				duration: 15,
				slug: "15-min-meeting",
				description: "Quick chat to say hello.",
			},
			{
				userId: user.id,
				title: "30 Min Discovery",
				duration: 30,
				slug: "30-min-discovery",
				description: "A deeper dive into your needs.",
			},
		])
		.returning();

	if (!eventType1 || !eventType2) throw new Error("Failed to create event types");

	console.log("Created event types:", eventType1.title, eventType2.title);

	// 3. Seed Availability (Monday - Friday, 9AM to 5PM)
	const availabilityData = [];
	for (let day = 1; day <= 5; day++) {
		availabilityData.push({
			userId: user.id,
			dayOfWeek: day,
			startTime: "09:00:00",
			endTime: "17:00:00",
		});
	}

	await db.insert(availability).values(availabilityData);
	console.log("Created availability for Monday-Friday.");

	// 4. Seed Bookings
	const tomorrow = set(addDays(new Date(), 1), {
		hours: 10,
		minutes: 0,
		seconds: 0,
		milliseconds: 0,
	});

	const endTomorrow = addMinutes(tomorrow, 15);

	await db.insert(bookings).values({
		eventTypeId: eventType1.id,
		guestEmail: "guest@example.com",
		guestName: "Guest User",
		startTime: tomorrow,
		endTime: endTomorrow,
	});

	console.log("Created sample booking.");
	console.log("Seeding complete!");
}

seed()
	.catch((e) => {
		console.error("Seeding failed:");
		console.error(e);
		process.exit(1);
	})
	.finally(() => {
		process.exit(0);
	});
