"use client";

import { motion } from "framer-motion";
import { momentumSpring } from "../../utils/motionUtils";
import { cn } from "../../utils/styleUtils";

interface CalendarGridProps {
	hours: string[];
	selectedHour?: string | undefined;
	onSelectHour: (hour: string) => void;
	className?: string | undefined;
}

export default function CalendarGrid({
	hours,
	selectedHour,
	onSelectHour,
	className,
}: CalendarGridProps) {
	return (
		<div className={cn("flex w-full flex-col gap-3", className)}>
			{hours.map((hour) => {
				const isSelected = selectedHour === hour;
				return (
					<button
						key={hour}
						onClick={() => onSelectHour(hour)}
						className="border-ultramarine/20 bg-surface hover:border-ultramarine focus-visible:ring-ultramarine focus-visible:ring-offset-background relative flex h-14 w-full items-center justify-center rounded-xl border px-4 py-2 transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
					>
						<span
							className={cn(
								"relative z-10 text-base font-semibold transition-colors",
								isSelected ? "text-white" : "text-ultramarine",
							)}
						>
							{hour}
						</span>
						{isSelected && (
							<motion.div
								layoutId="selected-hour"
								transition={momentumSpring}
								className="bg-ultramarine shadow-ultramarine/20 absolute inset-0 z-0 rounded-xl shadow-md"
							/>
						)}
					</button>
				);
			})}
		</div>
	);
}
