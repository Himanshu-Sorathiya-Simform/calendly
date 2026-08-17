import {
	addDays,
	addMinutes,
	isBefore,
	setHours,
	setMinutes,
	startOfDay,
} from "@himanshu-sorathiya/datetime";
import { eq } from "drizzle-orm";
import { Clock } from "lucide-react";
import { notFound } from "next/navigation";
import BookingCalendar from "../../../components/calendar/BookingCalendar";
import { db } from "../../../db";
import { availability, eventTypes, users } from "../../../db/schema";

interface BookingPageProps {
	params: Promise<{ shortId: string }>;
}

export default async function BookingPage({ params }: BookingPageProps) {
	const { shortId } = await params;

	const event = await db.query.eventTypes.findFirst({
		where: eq(eventTypes.shortId, shortId),
	});

	if (!event) {
		notFound();
	}

	const user = await db.query.users.findFirst({
		where: eq(users.id, event.userId),
	});

	if (!user) {
		notFound();
	}

	// Fetch availability rules
	const hostAvailability = await db.query.availability.findMany({
		where: eq(availability.userId, user.id),
	});

	// For MVP, generate a mock set of available slots for the next 30 days based on availability rules.
	// We'll generate them as UTC timestamps and pass to the client.
	const generatedSlotsUtc: string[] = [];
	const today = startOfDay(new Date());

	// Very basic generation: for next 30 days, if day matches a rule, generate slots.
	for (let i = 0; i < 30; i++) {
		const targetDate = addDays(today, i);
		const dayOfWeek = targetDate.getDay(); // 0-6

		const rulesForDay = hostAvailability.filter(
			(a) => a.dayOfWeek === dayOfWeek,
		);
		for (const rule of rulesForDay) {
			// rule.startTime and endTime are like "09:00:00"
			const partsStart = rule.startTime.split(":");
			const startHour = Number(partsStart[0]) || 0;
			const startMin = Number(partsStart[1]) || 0;

			const partsEnd = rule.endTime.split(":");
			const endHour = Number(partsEnd[0]) || 0;
			const endMin = Number(partsEnd[1]) || 0;

			let currentSlotTime = targetDate;
			currentSlotTime = setHours(currentSlotTime, startHour);
			currentSlotTime = setMinutes(currentSlotTime, startMin);

			const endSlotTime = targetDate;
			const finalEnd = setMinutes(setHours(endSlotTime, endHour), endMin);

			while (isBefore(currentSlotTime, finalEnd)) {
				// Don't generate slots in the past
				if (!isBefore(currentSlotTime, new Date())) {
					generatedSlotsUtc.push(currentSlotTime.toISOString());
				}
				currentSlotTime = addMinutes(currentSlotTime, event.duration);
			}
		}
	}

	return (
		<main className="flex h-dvh w-full flex-col overflow-hidden bg-white md:flex-row">
			{/* Left Sidebar: Host Context */}
			<div className="bg-background z-10 flex w-full shrink-0 flex-col justify-between border-b border-black/10 p-6 md:w-[35%] md:border-r md:border-b-0 md:p-12 lg:p-16">
				<div className="space-y-6">
					<div className="bg-graphite flex h-16 w-16 items-center justify-center overflow-hidden rounded-full text-2xl font-bold text-white">
						{user.name.charAt(0)}
					</div>
					<div>
						<h1 className="text-subtle mb-2 text-xs font-medium tracking-wider uppercase">
							{user.name}
						</h1>
						<h2 className="text-graphite text-3xl leading-tight font-bold tracking-tight text-balance md:text-5xl">
							{event.title}
						</h2>
					</div>

					<div className="space-y-4 pt-4 md:pt-8">
						<div className="text-graphite flex items-center gap-3 font-medium">
							<Clock className="text-subtle h-5 w-5" />
							<span>{event.duration} min</span>
						</div>

						{event.description && (
							<p className="text-subtle max-w-sm leading-relaxed">
								{event.description}
							</p>
						)}
					</div>
				</div>
			</div>

			{/* Right Side: The Grid */}
			<div className="bg-surface/30 relative flex h-full w-full flex-col overflow-hidden p-6 md:w-[65%] md:p-12 lg:p-16">
				<div className="mx-auto flex h-full w-full max-w-5xl flex-col">
					<div className="flex min-h-0 w-full flex-1 flex-col">
						<h3 className="text-graphite mb-8 w-full shrink-0 text-center text-xl font-bold tracking-tight xl:text-left">
							Select a Date & Time
						</h3>
						<div className="w-full flex-1 overflow-hidden">
							<BookingCalendar
								eventTypeId={event.id}
								eventDuration={event.duration}
								hostTimezone={user.timezone}
								availableSlotsUtc={generatedSlotsUtc}
							/>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
