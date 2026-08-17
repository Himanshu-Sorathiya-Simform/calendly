import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import EventTypeCard from "../../components/calendar/EventTypeCard";
import { db } from "../../db";
import { eventTypes, users } from "../../db/schema";

interface ProfilePageProps {
	params: Promise<{ username: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
	const { username } = await params;

	// Query user
	const user = await db.query.users.findFirst({
		where: eq(users.username, username),
	});

	if (!user) {
		notFound();
	}

	// Query their events
	const events = await db.query.eventTypes.findMany({
		where: eq(eventTypes.userId, user.id),
	});

	return (
		<main className="flex h-dvh w-full flex-col md:flex-row bg-white overflow-hidden">
			{/* Left Anchor: Host Intro */}
			<div className="bg-background w-full md:w-[40%] flex flex-col border-b md:border-b-0 md:border-r border-black/10 p-6 md:p-12 lg:p-16 h-full shrink-0 z-10">
				<div className="mt-auto md:mt-24">
					<div className="mb-6 flex h-24 w-24 items-center justify-center bg-graphite text-3xl font-bold text-white shadow-xl shadow-black/10 rounded-full">
						{user.name.charAt(0)}
					</div>
					<h1 className="text-graphite text-4xl md:text-5xl font-bold tracking-tight mb-4 leading-none">
						{user.name}
					</h1>
					<p className="text-subtle text-lg max-w-sm leading-relaxed">
						Select an event type to book a time on my calendar.
					</p>
				</div>
			</div>

			{/* Right Anchor: Event List */}
			<div className="w-full md:w-[60%] flex flex-col h-full overflow-y-auto bg-surface/30">
				<div className="w-full h-full max-w-3xl mx-auto p-6 md:p-12 lg:p-16">
					<div className="grid gap-6">
						{events.map((event) => (
							<EventTypeCard
								key={event.id}
								username={username}
								title={event.title}
								duration={event.duration}
								slug={event.slug}
								description={event.description}
							/>
						))}
					</div>

					{events.length === 0 && (
						<div className="border-2 border-dashed border-black/10 p-12 text-center text-subtle font-medium">
							No public event types configured.
						</div>
					)}
				</div>
			</div>
		</main>
	);
}
