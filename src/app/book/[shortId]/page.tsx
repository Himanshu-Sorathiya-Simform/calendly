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
import { getFreeBusy } from "../../../utils/googleCalendarUtils";

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

	// Fetch soft conflicts from Google Calendar
	let softConflicts: { start: string; end: string }[] = [];
	if (user.googleRefreshToken) {
		try {
			softConflicts = await getFreeBusy(
				user.googleRefreshToken,
				new Date(),
				addDays(new Date(), 30)
			);
		} catch (e) {
			console.error("Failed to fetch soft conflicts", e);
		}
	}

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
		<main className="flex min-h-dvh w-full flex-col overflow-hidden bg-background text-foreground md:flex-row selection:bg-ultramarine/30">
			{/* Left Sidebar: Host Context */}
			<div className="z-10 flex w-full shrink-0 flex-col justify-between p-6 md:w-[35%] md:p-12 lg:p-16 relative">
				<div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500 delay-100 fill-mode-both">
					<div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-surface border shadow-sm text-2xl font-bold text-graphite">
						{user.name.charAt(0)}
					</div>
					<div>
						<h1 className="text-subtle mb-3 text-xs font-semibold tracking-[0.1em] uppercase">
							{user.name}
						</h1>
						<h2 className="font-serif text-4xl leading-tight font-medium tracking-tight text-balance md:text-5xl text-graphite">
							{event.title}
						</h2>
					</div>

					<div className="space-y-5 pt-4 md:pt-8 border-t">
						<div className="flex items-center gap-3 font-medium text-subtle">
							<Clock className="text-ultramarine h-5 w-5" />
							<span>{event.duration} min</span>
						</div>

						{event.description && (
							<p className="text-subtle max-w-sm leading-relaxed text-sm">
								{event.description}
							</p>
						)}
					</div>
				</div>
                
                {/* Decorative background element for the left pane */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
                    <div className="absolute -top-[20%] -left-[20%] w-[140%] h-[140%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-black/[0.02] to-transparent blur-3xl rounded-full"></div>
                </div>
			</div>

			{/* Right Side: The Grid */}
			<div className="relative flex h-full w-full flex-col overflow-hidden p-6 md:w-[65%] md:p-12 lg:p-16">
				{/* Divider between panels */}
				<div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-black/10 to-transparent hidden md:block"></div>
                
				<div className="mx-auto flex h-full w-full max-w-5xl flex-col relative z-10 animate-in fade-in slide-in-from-right-4 duration-500 delay-200 fill-mode-both">
					<div className="flex min-h-0 w-full flex-1 flex-col">
						<div className="w-full flex-1 overflow-hidden">
							<BookingCalendar
								eventTypeId={event.id}
								eventDuration={event.duration}
								hostTimezone={user.timezone}
								availableSlotsUtc={generatedSlotsUtc}
                                softConflictsUtc={softConflicts}
							/>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
