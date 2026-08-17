import { auth } from "@clerk/nextjs/server";
import { format } from "@himanshu-sorathiya/datetime";
import { desc, eq, inArray } from "drizzle-orm";
import { Calendar, Clock } from "lucide-react";
import { redirect } from "next/navigation";
import { db } from "../../../db";
import { bookings, eventTypes, users } from "../../../db/schema";

export default async function BookingsPage() {
	const { userId: clerkUserId } = await auth();

	if (!clerkUserId) {
		redirect("/sign-in");
	}

	const user = await db.query.users.findFirst({
		where: eq(users.id, clerkUserId),
	});

	if (!user) {
		redirect("/sign-in");
	}

	// Fetch all event types for this user to get their IDs
	const userEventTypes = await db.query.eventTypes.findMany({
		where: eq(eventTypes.userId, user.id),
	});

	const eventTypeIds = userEventTypes.map((et) => et.id);

	// Fetch bookings for these event types
	let upcomingBookings: typeof bookings.$inferSelect[] = [];
	if (eventTypeIds.length > 0) {
		upcomingBookings = await db.query.bookings.findMany({
			where: inArray(bookings.eventTypeId, eventTypeIds),
			orderBy: [desc(bookings.startTime)],
		});
	}

	// Map bookings to include event type info
	const bookingsWithEventInfo = upcomingBookings.map((booking) => {
		const eventType = userEventTypes.find((et) => et.id === booking.eventTypeId);
		return {
			...booking,
			eventType,
		};
	});

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-graphite text-3xl font-bold tracking-tight">
					Bookings
				</h1>
				<p className="text-subtle mt-1 text-base">
					View your upcoming and past bookings.
				</p>
			</div>

			{bookingsWithEventInfo.length === 0 ? (
				<div className="bg-surface flex flex-col items-center justify-center rounded-2xl border border-dashed py-24 text-center">
					<div className="bg-black/5 flex h-12 w-12 items-center justify-center rounded-full mb-4">
						<Calendar className="text-subtle h-6 w-6" />
					</div>
					<h3 className="text-graphite text-lg font-semibold">
						No bookings yet
					</h3>
					<p className="text-subtle mt-2 max-w-sm">
						Share your event type links to start receiving bookings.
					</p>
				</div>
			) : (
				<div className="bg-surface overflow-hidden rounded-2xl border">
					<table className="w-full text-left text-sm">
						<thead className="bg-black/5 text-subtle font-medium uppercase tracking-wider text-xs">
							<tr>
								<th className="px-6 py-4">Guest</th>
								<th className="px-6 py-4">Event</th>
								<th className="px-6 py-4">Date & Time</th>
								<th className="px-6 py-4">Status</th>
							</tr>
						</thead>
						<tbody className="divide-y border-t">
							{bookingsWithEventInfo.map((booking) => (
								<tr key={booking.id} className="hover:bg-black/5 transition-colors">
									<td className="px-6 py-4">
										<div className="flex items-center gap-3">
											<div className="bg-graphite/10 text-graphite flex h-8 w-8 items-center justify-center rounded-full font-medium">
												{booking.guestName.charAt(0)}
											</div>
											<div>
												<div className="font-medium text-graphite">
													{booking.guestName}
												</div>
												<div className="text-subtle text-xs">
													{booking.guestEmail}
												</div>
											</div>
										</div>
									</td>
									<td className="px-6 py-4 text-graphite font-medium">
										{booking.eventType?.title || "Unknown Event"}
									</td>
									<td className="px-6 py-4 text-subtle">
										<div className="flex flex-col gap-1">
											<span className="text-graphite font-medium">
												{format(new Date(booking.startTime), "MMM d, yyyy")}
											</span>
											<span className="flex items-center gap-1 text-xs">
												<Clock className="h-3 w-3" />
												{format(new Date(booking.startTime), "h:mm a")} - {format(new Date(booking.endTime), "h:mm a")}
											</span>
										</div>
									</td>
									<td className="px-6 py-4">
										<span className="bg-green-100 text-green-800 rounded-full px-2.5 py-1 text-xs font-semibold">
											Confirmed
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
