import { addDays, addMinutes, isBefore, setHours, setMinutes, startOfDay } from "@himanshu-sorathiya/datetime";
import { eq } from "drizzle-orm";
import { Clock } from "lucide-react";
import { notFound } from "next/navigation";
import BookingCalendar from "../../../components/calendar/BookingCalendar";
import { db } from "../../../db";
import { availability, eventTypes, users } from "../../../db/schema";

interface BookingPageProps {
	params: Promise<{ username: string; eventSlug: string }>;
}

export default async function BookingPage({ params }: BookingPageProps) {
	const { username, eventSlug } = await params;

	// Query user and event
	const user = await db.query.users.findFirst({
		where: eq(users.username, username),
	});

	if (!user) {
		notFound();
	}

	const event = await db.query.eventTypes.findFirst({
		where: eq(eventTypes.slug, eventSlug),
	});

	if (!event || event.userId !== user.id) {
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

		const rulesForDay = hostAvailability.filter(a => a.dayOfWeek === dayOfWeek);
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
		<main className="flex h-dvh w-full flex-col md:flex-row bg-white overflow-hidden">
			{/* Left Sidebar: Host Context */}
			<div className="bg-background w-full md:w-[35%] flex flex-col justify-between border-b md:border-b-0 md:border-r border-black/10 p-6 md:p-12 lg:p-16 shrink-0 z-10">
				<div className="space-y-6">
					<div className="h-16 w-16 overflow-hidden rounded-full bg-graphite flex items-center justify-center text-white text-2xl font-bold">
						{user.name.charAt(0)}
					</div>
					<div>
						<h1 className="text-subtle font-medium uppercase tracking-wider text-xs mb-2">
							{user.name}
						</h1>
						<h2 className="text-graphite text-3xl md:text-5xl font-bold tracking-tight text-balance leading-tight">
							{event.title}
						</h2>
					</div>

					<div className="pt-4 md:pt-8 space-y-4">
						<div className="flex items-center gap-3 text-graphite font-medium">
							<Clock className="h-5 w-5 text-subtle" />
							<span>{event.duration} min</span>
						</div>

						{event.description && (
							<p className="text-subtle leading-relaxed max-w-sm">
								{event.description}
							</p>
						)}
					</div>
				</div>
			</div>

			{/* Right Side: The Grid */}
			<div className="w-full md:w-[65%] p-6 md:p-12 lg:p-16 flex flex-col h-full overflow-hidden relative bg-surface/30">
				<div className="w-full h-full flex flex-col mx-auto max-w-5xl">
					<div className="w-full flex-1 min-h-0 flex flex-col">
						<h3 className="text-graphite text-xl font-bold tracking-tight mb-8 shrink-0 w-full text-center xl:text-left">
							Select a Date & Time
						</h3>
						<div className="flex-1 w-full overflow-hidden">
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
