"use client";

import { motion } from "framer-motion";
import { cn } from "../../utils/styleUtils";

interface CalendarGridProps {
	hours: string[];
	selectedHour?: string | undefined;
	onSelectHour: (hour: string) => void;
	onConfirm?: () => void;
	className?: string;
	hasSoftConflict?: boolean;
}

export default function CalendarGrid({
	hours,
	selectedHour,
	onSelectHour,
	onConfirm,
	className,
	hasSoftConflict = false,
}: CalendarGridProps) {
	return (
		<div className={cn("flex w-full flex-col gap-2", className)}>
			{hours.map((hour) => {
				const isSelected = selectedHour === hour;
				return (
					<div key={hour} className="flex flex-col w-full gap-2 mb-2">
						<div className="flex items-center w-full h-14 gap-2">
							<motion.button
								onClick={() => onSelectHour(hour)}
								whileTap={{ scale: 0.98 }}
								transition={{ type: "spring", bounce: 0, duration: 0.3 }}
								className={cn(
									"relative flex h-full items-center justify-center rounded-2xl font-semibold transition-all focus-visible:outline-none shrink-0 border",
									isSelected
										? "w-[48%] bg-graphite text-white border-transparent shadow-md"
										: "w-full bg-white text-graphite border-black/5 shadow-sm hover:border-black/10 hover:shadow-md"
								)}
							>
								{hour}
							</motion.button>

						{isSelected && (
							<motion.button
								initial={{ opacity: 0, scale: 0.95, x: -10 }}
								animate={{ opacity: 1, scale: 1, x: 0 }}
								transition={{ type: "spring", bounce: 0, duration: 0.3, delay: 0.05 }}
								onClick={(e) => {
									e.stopPropagation();
									onConfirm?.();
								}}
								className="flex h-full w-[48%] grow items-center justify-center rounded-2xl bg-ultramarine font-bold text-white shadow-lg shadow-ultramarine/20 transition-colors hover:bg-ultramarine/90 focus-visible:outline-none"
							>
								Next
							</motion.button>
						)}
						</div>
						
						{/* Soft Conflict Warning */}
						{isSelected && hasSoftConflict && (
							<motion.div
								initial={{ opacity: 0, height: 0, y: -10 }}
								animate={{ opacity: 1, height: "auto", y: 0 }}
								transition={{ type: "spring", bounce: 0, duration: 0.3 }}
								className="overflow-hidden"
							>
								<div className="w-full bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs px-4 py-3 rounded-xl">
									Host has a potential conflict here. You can still proceed or select another time.
								</div>
							</motion.div>
						)}
					</div>
				);
			})}
		</div>
	);
}
