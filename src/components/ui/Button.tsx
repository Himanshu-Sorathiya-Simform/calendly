"use client";

import { Slot } from "@radix-ui/react-slot";
import { type HTMLMotionProps, motion } from "framer-motion";
import type { HTMLAttributes } from "react";
import { uiSpring } from "../../utils/motionUtils";
import { cn } from "../../utils/styleUtils";

export interface ButtonProps extends HTMLMotionProps<"button"> {
	asChild?: boolean;
	variant?: "primary" | "secondary" | "ghost" | "destructive";
}

const MotionButton = motion.create("button");

export default function Button({
	className,
	variant = "primary",
	asChild = false,
	...props
}: ButtonProps) {
	const baseStyles =
		"inline-flex items-center justify-center whitespace-nowrap text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ultramarine focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 px-5 py-2.5 h-11 rounded-full";

	const variants = {
		primary:
			"bg-ultramarine text-white hover:bg-ultramarine/90 shadow-sm shadow-ultramarine/20",
		secondary:
			"bg-surface text-graphite hover:bg-gray-50 shadow-sm border border-black/5",
		ghost: "bg-transparent text-graphite hover:bg-black/5",
		destructive:
			"bg-red-ink text-white hover:bg-red-ink/90 shadow-sm shadow-red-ink/20",
	};

	const combinedClassName = cn(baseStyles, variants[variant], className);

	if (asChild) {
		return (
			<Slot
				className={combinedClassName}
				{...(props as unknown as HTMLAttributes<HTMLElement>)}
			/>
		);
	}

	return (
		<MotionButton
			className={combinedClassName}
			whileTap={{ scale: 0.97 }}
			transition={uiSpring}
			{...props}
		/>
	);
}
