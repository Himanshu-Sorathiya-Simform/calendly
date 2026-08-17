import * as React from "react";
import { cn } from "../../utils/styleUtils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className, type, ...props }: InputProps) {
	return (
		<input
			type={type}
			className={cn(
				"bg-surface text-graphite placeholder:text-subtle focus-visible:border-ultramarine focus-visible:ring-ultramarine flex h-12 w-full rounded-xl border border-black/10 px-4 py-2 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
				className,
			)}
			{...props}
		/>
	);
}
