"use client";

import { Save } from "lucide-react";
import { useState, useTransition } from "react";
import { updateAvailability } from "../../app/actions/availabilityActions";
import Button from "../ui/Button";

const DAYS_OF_WEEK = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];

interface AvailabilityRule {
	dayOfWeek: number;
	startTime: string;
	endTime: string;
}

interface AvailabilityFormProps {
	initialAvailability: AvailabilityRule[];
}

export default function AvailabilityForm({ initialAvailability }: AvailabilityFormProps) {
	const [isPending, startTransition] = useTransition();
	const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setMessage(null);
		const formData = new FormData(e.currentTarget);
		
		startTransition(async () => {
			const result = await updateAvailability(formData);
			setMessage({ type: result.status as "success" | "error", text: result.message });
			
			if (result.status === "success") {
				setTimeout(() => setMessage(null), 3000);
			}
		});
	};

	return (
		<form onSubmit={handleSubmit} className="bg-surface overflow-hidden rounded-2xl border">
			<div className="border-b p-6">
				<h3 className="text-graphite font-semibold">Weekly Hours</h3>
				<p className="text-subtle text-sm">
					These are the times you are generally available to take meetings.
				</p>
			</div>
			
			<div className="p-6 space-y-6">
				{DAYS_OF_WEEK.map((day, index) => {
					// For simplicity in MVP, we take the first rule for a day.
					const rule = initialAvailability.find((a) => a.dayOfWeek === index);
					const hasRule = !!rule;

					return (
						<div key={day} className="flex items-center gap-6">
							<div className="w-32 shrink-0 flex items-center gap-3">
								<input 
									type="checkbox" 
									name={`day_${index}_enabled`}
									defaultChecked={hasRule} 
									className="h-4 w-4 rounded border-gray-300 text-ultramarine focus:ring-ultramarine"
								/>
								<span className="font-medium text-graphite">
									{day}
								</span>
							</div>

							<div className="flex-1 flex items-center gap-3">
								<input 
									type="time" 
									name={`day_${index}_start`}
									defaultValue={rule ? rule.startTime.slice(0, 5) : "09:00"}
									className="border border-black/10 rounded-md px-3 py-1.5 text-sm bg-white text-graphite font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ultramarine"
								/>
								<span className="text-subtle">-</span>
								<input 
									type="time" 
									name={`day_${index}_end`}
									defaultValue={rule ? rule.endTime.slice(0, 5) : "17:00"}
									className="border border-black/10 rounded-md px-3 py-1.5 text-sm bg-white text-graphite font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ultramarine"
								/>
							</div>
						</div>
					);
				})}
			</div>
			
			<div className="border-t bg-black/5 p-6 flex justify-between items-center">
				<div>
					{message && (
						<p className={`text-sm font-medium ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
							{message.text}
						</p>
					)}
				</div>
				<Button type="submit" disabled={isPending} className="flex items-center gap-2 bg-ultramarine text-white hover:bg-ultramarine/90 border-none font-semibold">
					<Save className="h-4 w-4" />
					{isPending ? "Saving..." : "Save Changes"}
				</Button>
			</div>
		</form>
	);
}
