"use client";

import { motion } from "framer-motion";
import { uiSpring } from "../../utils/motionUtils";
import { cn } from "../../utils/styleUtils";

interface CalendarGridProps {
	hours: string[];
	selectedHour?: string | undefined;
	onSelectHour: (hour: string) => void;
	onConfirm?: () => void;
	className?: string;
}

export default function CalendarGrid({
	hours,
	selectedHour,
	onSelectHour,
	onConfirm,
	className,
}: CalendarGridProps) {
	return (
		<div className={cn("flex w-full flex-col gap-2", className)}>
			{hours.map((hour) => {
				const isSelected = selectedHour === hour;
				return (
					<div key={hour} className="flex items-center w-full h-13 gap-2">
						<motion.button
							onClick={() => onSelectHour(hour)}
							whileTap={{ scale: 0.97 }}
							transition={uiSpring}
							className={cn(
								"relative flex h-full items-center justify-center rounded-2xl font-semibold transition-colors focus-visible:outline-none shrink-0",
								isSelected
									? "w-[48%] bg-graphite text-white shadow-md shadow-black/10"
									: "w-full bg-white border border-black/10 text-graphite hover:border-black/30 hover:shadow-sm"
							)}
						>
							{hour}
						</motion.button>

						{isSelected && (
							<motion.button
								initial={{ opacity: 0, scale: 0.95, x: -10 }}
								animate={{ opacity: 1, scale: 1, x: 0 }}
								transition={uiSpring}
								onClick={(e) => {
									e.stopPropagation();
									onConfirm?.();
								}}
								className="flex h-full w-[48%] grow items-center justify-center rounded-2xl bg-ultramarine font-bold text-white shadow-md shadow-ultramarine/20 transition-colors hover:bg-ultramarine/90 focus-visible:outline-none"
							>
								Next
							</motion.button>
						)}
					</div>
				);
			})}
		</div>
	);
}
