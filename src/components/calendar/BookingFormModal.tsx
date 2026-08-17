"use client";

import { useActionState, useEffect } from "react";
import { createBooking } from "../../app/actions/bookingActions";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Modal from "../ui/Modal";

interface BookingFormModalProps {
	isOpen: boolean;
	onClose: () => void;
	eventTypeId: number;
	startTime: Date;
	endTime: Date;
}

type FormState = {
	status: "idle" | "success" | "error";
	message: string;
};

export default function BookingFormModal({
	isOpen,
	onClose,
	eventTypeId,
	startTime,
	endTime,
}: BookingFormModalProps) {
	// React 19 useActionState hook
	const [state, formAction, isPending] = useActionState(createBooking, {
		status: "idle",
		message: "",
	} as FormState);

	// For Optimistic UI feedback we could use useOptimistic,
	// but within a modal, showing a loading state via useActionState is clean.

	useEffect(() => {
		if (state.status === "success") {
			// Redirect or close is handled here, or we can rely on a redirect in the action.
			// Since user said "whichever you feel best", the action will just redirect.
		} else if (state.status === "error") {
			// error state is handled by rendering state.message
		}
	}, [state]);

	return (
		<Modal isOpen={isOpen} onOpenChange={onClose}>
			<div className="space-y-4">
				<h3 className="text-graphite text-2xl font-serif font-medium tracking-tight">
					Confirm your Booking
				</h3>
				<p className="text-subtle text-sm">
					You are booking a slot for <strong>{startTime.toLocaleString([], { dateStyle: "long", timeStyle: "short" })}</strong>.
				</p>

				<form action={formAction} className="space-y-4 pt-2">
					<input type="hidden" name="eventTypeId" value={eventTypeId} />
					<input type="hidden" name="startTime" value={startTime.toISOString()} />
					<input type="hidden" name="endTime" value={endTime.toISOString()} />

					<div className="space-y-4">
						<div>
							<label htmlFor="name" className="text-sm font-medium text-graphite block mb-2">
								Name
							</label>
							<Input id="name" name="name" type="text" placeholder="Your name" required className="bg-white border-black/10 text-graphite placeholder:text-subtle focus-visible:ring-ultramarine" />
						</div>
						<div>
							<label htmlFor="email" className="text-sm font-medium text-graphite block mb-2">
								Email
							</label>
							<Input id="email" name="email" type="email" placeholder="you@example.com" required className="bg-white border-black/10 text-graphite placeholder:text-subtle focus-visible:ring-ultramarine" />
						</div>
					</div>

					{state.status === "error" && (
						<p className="text-destructive text-sm">{state.message}</p>
					)}

					<div className="flex justify-end gap-3 pt-6 border-t mt-4">
						<Button variant="ghost" onClick={onClose} type="button" disabled={isPending} className="text-subtle hover:bg-black/5 hover:text-graphite">
							Cancel
						</Button>
						<Button type="submit" disabled={isPending} className="bg-ultramarine text-white hover:bg-ultramarine/90 border-none font-semibold">
							{isPending ? "Confirming..." : "Confirm Booking"}
						</Button>
					</div>
				</form>
			</div>
		</Modal>
	);
}
