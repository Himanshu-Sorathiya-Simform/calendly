"use client";

import { useEffect } from "react";
import Button from "../../../components/ui/Button";

export default function BookingError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error("Booking page error:", error);
	}, [error]);

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-4">
			<div className="max-w-md text-center space-y-4">
				<h2 className="text-2xl font-serif font-bold text-graphite">Something went wrong</h2>
				<p className="text-subtle text-sm">
					We had trouble loading this booking page. It might be a temporary network connection issue.
				</p>
				<Button
					onClick={() => reset()}
					className="bg-ultramarine text-white hover:bg-ultramarine/90"
				>
					Try again
				</Button>
			</div>
		</div>
	);
}
