"use client";

import { useState } from "react";
import CalendarGrid from "../components/calendar/CalendarGrid";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";

export default function Home() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedHour, setSelectedHour] = useState<string | undefined>();
	const hours = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM"];

	return (
		<main className="mx-auto max-w-2xl p-8 pb-24 font-sans">
			<h1 className="text-graphite mb-12 text-4xl font-bold tracking-tight text-balance">
				Design System Playground
			</h1>

			<div className="space-y-12">
				<section>
					<h2 className="text-graphite mb-6 text-2xl font-medium">
						Buttons
					</h2>
					<div className="flex flex-wrap gap-4">
						<Button variant="primary">Primary Action</Button>
						<Button variant="secondary">Secondary Action</Button>
						<Button variant="ghost">Ghost Action</Button>
						<Button variant="destructive">Destructive Action</Button>
					</div>
				</section>

				<section>
					<h2 className="text-graphite mb-6 text-2xl font-medium">
						Inputs
					</h2>
					<div className="max-w-sm space-y-4">
						<Input
							type="text"
							placeholder="Enter your name..."
						/>
						<Input
							type="email"
							placeholder="Email address..."
							disabled
						/>
					</div>
				</section>

				<section>
					<h2 className="text-graphite mb-6 text-2xl font-medium">
						Modal
					</h2>
					<Button onClick={() => setIsModalOpen(true)}>
						Open Glass Modal
					</Button>
					<Modal
						isOpen={isModalOpen}
						onOpenChange={setIsModalOpen}
					>
						<div className="space-y-4">
							<h3 className="text-graphite text-xl font-semibold">
								Confirm Booking
							</h3>
							<p className="text-subtle text-sm">
								Are you sure you want to confirm this time slot? This
								action cannot be undone.
							</p>
							<div className="flex justify-end gap-3 pt-4">
								<Button
									variant="ghost"
									onClick={() => setIsModalOpen(false)}
								>
									Cancel
								</Button>
								<Button onClick={() => setIsModalOpen(false)}>
									Confirm
								</Button>
							</div>
						</div>
					</Modal>
				</section>

				<section>
					<h2 className="text-graphite mb-6 text-2xl font-medium">
						Calendar Grid (Apple-style)
					</h2>
					<div className="rounded-2xl border border-black/5 bg-transparent p-1">
						<CalendarGrid
							hours={hours}
							selectedHour={selectedHour}
							onSelectHour={setSelectedHour}
						/>
					</div>
				</section>
			</div>
		</main>
	);
}
