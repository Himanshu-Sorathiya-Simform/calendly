import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { Clock, Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import CopyLinkButton from "../../components/dashboard/CopyLinkButton";
import CreateBookingLinkModal from "../../components/dashboard/CreateBookingLinkModal";
import EditBookingLinkModal from "../../components/dashboard/EditBookingLinkModal";
import { db } from "../../db";
import { eventTypes, users } from "../../db/schema";

export default async function DashboardPage() {
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

	const userEventTypes = await db.query.eventTypes.findMany({
		where: eq(eventTypes.userId, user.id),
		orderBy: (eventTypes, { desc }) => [desc(eventTypes.id)],
	});

	return (
		<div className="space-y-8">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-graphite text-3xl font-bold tracking-tight">
						Booking Links
					</h1>
					<p className="text-subtle mt-1 text-base">
						Create and manage your booking links.
					</p>
				</div>
				<CreateBookingLinkModal>
					<button className="flex items-center gap-2 bg-graphite text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-graphite/90 transition-colors">
						<Plus className="h-4 w-4" />
						New Booking Link
					</button>
				</CreateBookingLinkModal>
			</div>

			{userEventTypes.length === 0 ? (
				<div className="bg-surface flex flex-col items-center justify-center rounded-2xl border border-dashed py-24 text-center">
					<h3 className="text-graphite text-lg font-semibold">
						No booking links yet
					</h3>
					<p className="text-subtle mt-2 max-w-sm mb-6">
						Create your first booking link to start accepting meetings from your clients.
					</p>
					<CreateBookingLinkModal>
						<button className="flex items-center gap-2 bg-graphite text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-graphite/90 transition-colors">
							<Plus className="h-4 w-4" />
							Create Booking Link
						</button>
					</CreateBookingLinkModal>
				</div>
			) : (
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{userEventTypes.map((event) => (
						<div
							key={event.id}
							className="bg-surface group relative flex flex-col justify-between overflow-hidden rounded-2xl border p-6 transition-all hover:shadow-md"
						>
							<div className="absolute top-0 left-0 h-1 w-full bg-ultramarine" />
							<div>
								<h3 className="text-graphite text-xl font-semibold">
									{event.title}
								</h3>
								<div className="text-subtle mt-3 flex items-center gap-2 text-sm font-medium">
									<Clock className="h-4 w-4" />
									{event.duration} mins
								</div>
								{event.description && (
									<p className="text-subtle mt-4 line-clamp-2 text-sm">
										{event.description}
									</p>
								)}
							</div>

							<div className="mt-8 flex items-center justify-between border-t pt-4">
								<Link
									href={`/book/${event.shortId}`}
									className="text-ultramarine text-sm font-medium hover:underline"
								>
									View booking page
								</Link>
								<div className="flex items-center gap-2">
									<EditBookingLinkModal event={event}>
										<button className="text-subtle hover:text-graphite flex items-center gap-1 rounded-md px-2 py-1 text-sm transition-colors hover:bg-black/5">
											Edit
										</button>
									</EditBookingLinkModal>
									<CopyLinkButton link={`http://localhost:3000/book/${event.shortId}`} />
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
