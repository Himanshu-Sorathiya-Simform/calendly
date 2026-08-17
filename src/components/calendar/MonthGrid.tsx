"use client";

import {
	addMonths,
	eachDayOfInterval,
	endOfMonth,
	format,
	isSameDay,
	isToday,
	startOfDay,
	startOfMonth,
	subMonths,
} from "@himanshu-sorathiya/datetime";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "../../utils/styleUtils";

interface MonthGridProps {
	onSelectDate: (date: Date) => void;
	selectedDate?: Date | undefined;
}

export default function MonthGrid({ onSelectDate, selectedDate }: MonthGridProps) {
	const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));

	const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
	const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

	const monthStart = startOfMonth(currentMonth);
	const monthEnd = endOfMonth(monthStart);
	const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
	const emptyDays = Array.from({ length: monthStart.getDay() });
	const isCurrentMonthOrPast = currentMonth <= startOfMonth(new Date());

	return (
		<div className="w-full shrink-0 xl:max-w-sm">
			<div className="mb-4 flex items-center justify-between">
				<h3 className="text-graphite font-semibold">
					{format(currentMonth, "MMMM yyyy")}
				</h3>
				<div className="flex items-center gap-2">
					{!isCurrentMonthOrPast && (
						<button
							onClick={() => setCurrentMonth(startOfMonth(new Date()))}
							className="text-ultramarine hover:text-ultramarine/80 mr-2 text-xs font-medium transition-colors focus-visible:outline-none"
						>
							Today
						</button>
					)}
					<button
						onClick={handlePrevMonth}
						disabled={isCurrentMonthOrPast}
						className="text-graphite flex h-8 w-8 items-center justify-center rounded-full bg-black/5 transition-colors hover:bg-black/10 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-30"
					>
						<ChevronLeft className="h-4 w-4" />
					</button>
					<button
						onClick={handleNextMonth}
						className="text-graphite flex h-8 w-8 items-center justify-center rounded-full bg-black/5 transition-colors hover:bg-black/10 focus-visible:outline-none"
					>
						<ChevronRight className="h-4 w-4" />
					</button>
				</div>
			</div>

			<div className="rounded-3xl border border-black/8 bg-white p-4 shadow-sm">
				<div className="mb-2 grid grid-cols-7">
					{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
						<div
							key={day}
							className="text-subtle text-center text-xs font-medium tracking-wider uppercase"
						>
							{day}
						</div>
					))}
				</div>

				<div className="relative min-h-75 overflow-hidden">
					<AnimatePresence
						mode="popLayout"
						initial={false}
					>
						<motion.div
							key={currentMonth.toISOString()}
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -20 }}
							transition={{ type: "spring", bounce: 0, duration: 0.3 }}
							className="absolute inset-0 grid h-max grid-cols-7 gap-y-2"
						>
							{emptyDays.map((_, i) => (
								<div
									key={`empty-${i}`}
									className="h-10 w-full"
								/>
							))}
							{daysInMonth.map((day) => {
								const isSelected =
									selectedDate && isSameDay(day, selectedDate);
								const isPastDay = day < startOfDay(new Date());
								const isCurrentDay = isToday(day);

								return (
									<motion.button
										key={day.toISOString()}
										onClick={() =>
											!isPastDay && onSelectDate(day)
										}
										disabled={isPastDay}
										whileTap={!isPastDay ? { scale: 0.95 } : {}}
										className={cn(
											"relative mx-auto flex h-10 w-10 items-center justify-center rounded-full font-medium transition-colors focus-visible:outline-none",
											isPastDay ?
												"cursor-not-allowed text-black/20"
											: isSelected ?
												"bg-ultramarine shadow-ultramarine/20 text-white shadow-md"
											: isCurrentDay ?
												"border-ultramarine text-ultramarine bg-ultramarine/5 hover:bg-ultramarine/10 border"
											:	"text-graphite hover:bg-black/5",
										)}
									>
										<span className="relative z-10">
											{format(day, "d")}
										</span>
									</motion.button>
								);
							})}
						</motion.div>
					</AnimatePresence>
				</div>
			</div>
		</div>
	);
}
