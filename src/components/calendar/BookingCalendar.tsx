"use client";

import { format, isSameDay } from "@himanshu-sorathiya/datetime";
import { useMemo, useState } from "react";
import BookingFormModal from "./BookingFormModal";
import CalendarGrid from "./CalendarGrid";
import MonthGrid from "./MonthGrid";

interface BookingCalendarProps {
	eventTypeId: number;
	eventDuration: number;
	hostTimezone: string;
	// In a real app, this would be raw availability rules and we compute it.
	// For MVP, we'll mock available slots for the next 30 days based on the host's rules.
	availableSlotsUtc: string[];
}

export default function BookingCalendar({
	eventTypeId,
	eventDuration,
	availableSlotsUtc,
}: BookingCalendarProps) {
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
	const [selectedSlot, setSelectedSlot] = useState<string | undefined>(undefined);
	const [isModalOpen, setIsModalOpen] = useState(false);

	// Map UTC strings to Date objects in the user's local timezone
	const slotsAsDates = useMemo(() => {
		return availableSlotsUtc.map((utcStr) => new Date(utcStr));
	}, [availableSlotsUtc]);

	// Filter slots for the currently selected date
	const slotsForSelectedDate = useMemo(() => {
		if (!selectedDate) return [];
		return slotsAsDates.filter((d) => isSameDay(d, selectedDate));
	}, [selectedDate, slotsAsDates]);

	// Format them for the UI (e.g. "9:00 AM")
	const formattedSlotsForSelectedDate = useMemo(() => {
		return slotsForSelectedDate.map(d => format(d, "hh:mm a"));
	}, [slotsForSelectedDate]);

	const handleSlotSelect = (slot: string) => {
		setSelectedSlot(slot);
	};

	const handleConfirm = () => {
		setIsModalOpen(true);
	};

	// Determine the exact Date object for the chosen slot
	const selectedDateObj = useMemo(() => {
		if (!selectedSlot || !selectedDate) return null;
		// Find the original Date object that formatted to this slot
		const idx = formattedSlotsForSelectedDate.indexOf(selectedSlot);
		return idx !== -1 ? slotsForSelectedDate[idx] : null;
	}, [selectedSlot, selectedDate, formattedSlotsForSelectedDate, slotsForSelectedDate]);

	// Calculate end time
	const endTimeObj = useMemo(() => {
		if (!selectedDateObj) return null;
		return new Date(selectedDateObj.getTime() + eventDuration * 60000);
	}, [selectedDateObj, eventDuration]);

	return (
		<div className="flex flex-col xl:flex-row gap-8 w-full max-w-200 mx-auto h-full min-h-0 items-start overflow-hidden">
			{/* Calendar Grid Container (Fixed width behavior) */}
			<div className="w-full xl:w-105 shrink-0 h-full overflow-y-auto hidden-scrollbar pb-12">
				<MonthGrid
					selectedDate={selectedDate || undefined}
					onSelectDate={(d) => {
						setSelectedDate(d);
						setSelectedSlot(undefined);
					}}
				/>
			</div>

			{selectedDate && (
				<div className="w-full xl:w-80 shrink-0 flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
					<div className="mb-4 sticky top-0 bg-white/60 backdrop-blur-xl z-10 py-3 px-1 rounded-2xl">
						<h3 className="text-graphite font-semibold text-center xl:text-left">
							{format(selectedDate, "EEEE, MMMM d")}
						</h3>
					</div>

					{formattedSlotsForSelectedDate.length > 0 ? (
						<div className="flex-1 overflow-y-auto hidden-scrollbar pb-12">
							<CalendarGrid
								hours={formattedSlotsForSelectedDate}
								selectedHour={selectedSlot}
								onSelectHour={handleSlotSelect}
								onConfirm={handleConfirm}
							/>
						</div>
					) : (
						<p className="text-subtle text-sm">No available slots for this date.</p>
					)}
				</div>
			)}

			{selectedDateObj && endTimeObj && (
				<BookingFormModal
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					eventTypeId={eventTypeId}
					startTime={selectedDateObj}
					endTime={endTimeObj}
				/>
			)}
		</div>
	);
}
