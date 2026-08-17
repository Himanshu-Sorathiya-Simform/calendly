"use client";

import { useState, useTransition } from "react";
import { updateBookingLink, deleteBookingLink } from "../../app/actions/dashboardActions";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Modal from "../ui/Modal";

interface EditBookingLinkModalProps {
	children: React.ReactNode;
	event: {
		id: number;
		title: string;
		duration: number;
		description: string | null;
	};
}

export default function EditBookingLinkModal({ children, event }: EditBookingLinkModalProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState("");

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError("");
		const formData = new FormData(e.currentTarget);
		
		startTransition(async () => {
			const result = await updateBookingLink(event.id, formData);
			if (result.status === "success") {
				setIsOpen(false);
			} else {
				setError(result.message);
			}
		});
	};

	const handleDelete = () => {
		if (confirm("Are you sure you want to delete this booking link?")) {
			startTransition(async () => {
				const result = await deleteBookingLink(event.id);
				if (result.status === "success") {
					setIsOpen(false);
				} else {
					setError(result.message);
				}
			});
		}
	};

	return (
		<>
			<div onClick={() => setIsOpen(true)}>{children}</div>

			<Modal isOpen={isOpen} onOpenChange={setIsOpen}>
				<div className="space-y-4">
					<div className="flex justify-between items-start">
						<div>
							<h3 className="text-graphite text-2xl font-serif font-medium tracking-tight">
								Edit Booking Link
							</h3>
							<p className="text-subtle text-sm">
								Update the details for this booking link.
							</p>
						</div>
					</div>

					<form onSubmit={handleSubmit} className="space-y-4 pt-2">
						<div className="space-y-4">
							<div>
								<label htmlFor="title" className="text-sm font-medium text-graphite block mb-2">
									Event Title
								</label>
								<Input 
									id="title" 
									name="title" 
									type="text" 
									defaultValue={event.title}
									placeholder="e.g. 30 Min Discovery Call" 
									required 
									className="bg-white border-black/10 text-graphite placeholder:text-subtle focus-visible:ring-ultramarine" 
								/>
							</div>
							
							<div>
								<label htmlFor="duration" className="text-sm font-medium text-graphite block mb-2">
									Duration (minutes)
								</label>
								<Input 
									id="duration" 
									name="duration" 
									type="number" 
									min="5" 
									step="5"
									defaultValue={event.duration.toString()}
									required 
									className="bg-white border-black/10 text-graphite placeholder:text-subtle focus-visible:ring-ultramarine" 
								/>
							</div>

							<div>
								<label htmlFor="description" className="text-sm font-medium text-graphite block mb-2">
									Description (Optional)
								</label>
								<textarea 
									id="description" 
									name="description" 
									defaultValue={event.description || ""}
									placeholder="Provide details about the meeting..."
									className="flex min-h-[80px] w-full rounded-md bg-white border border-black/10 px-3 py-2 text-sm text-graphite placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ultramarine disabled:cursor-not-allowed disabled:opacity-50 resize-none"
								/>
							</div>
						</div>

						{error && (
							<p className="text-destructive text-sm">{error}</p>
						)}

						<div className="flex justify-between items-center pt-6 border-t mt-4">
							<Button variant="ghost" onClick={handleDelete} type="button" disabled={isPending} className="text-red-600 hover:bg-red-50 hover:text-red-700 px-3 py-1.5 h-auto text-sm">
								Delete Link
							</Button>
							
							<div className="flex gap-3">
								<Button variant="ghost" onClick={() => setIsOpen(false)} type="button" disabled={isPending} className="text-subtle hover:bg-black/5 hover:text-graphite">
									Cancel
								</Button>
								<Button type="submit" disabled={isPending} className="bg-ultramarine text-white hover:bg-ultramarine/90 border-none font-semibold">
									{isPending ? "Saving..." : "Save Changes"}
								</Button>
							</div>
						</div>
					</form>
				</div>
			</Modal>
		</>
	);
}
