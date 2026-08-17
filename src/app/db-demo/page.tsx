import { db } from "@/db";
import { availability, bookings, eventTypes, users } from "@/db/schema";

// Force dynamic rendering since we are reading from DB
export const dynamic = "force-dynamic";

export default async function DbDemoPage() {
	let data = null;
	let errorMsg = null;

	try {
		const allUsers = await db.select().from(users);
		const allEventTypes = await db.select().from(eventTypes);
		const allAvailability = await db.select().from(availability);
		const allBookings = await db.select().from(bookings);

		data = {
			users: allUsers,
			eventTypes: allEventTypes,
			availability: allAvailability,
			bookings: allBookings,
		};
	} catch (error: unknown) {
		errorMsg = error instanceof Error ? error.message : String(error);
	}

	if (errorMsg || !data) {
		return (
			<div className="mx-auto max-w-4xl space-y-8 p-8 font-sans">
				<h1 className="mb-4 text-3xl font-bold text-red-600">
					Database Connection Error
				</h1>
				<div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800">
					<p className="mb-4">
						Failed to connect to the Neon database or fetch data. Have
						you run the migrations and seed script?
					</p>
					<pre className="overflow-auto rounded-lg bg-red-950 p-4 text-sm text-red-50">
						{errorMsg}
					</pre>
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-4xl space-y-8 p-8 font-sans">
			<h1 className="mb-4 text-3xl font-bold text-slate-800">
				Database Demo (Phase 2)
			</h1>
			<p className="mb-8 text-slate-600">
				This page fetches data directly from the Neon database using Drizzle
				ORM to verify Phase 2 setup.
			</p>

			<section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
				<div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
					<h2 className="text-xl font-semibold text-slate-700">
						Users ({data.users.length})
					</h2>
				</div>
				<div className="p-6">
					<pre className="overflow-auto rounded-lg bg-slate-900 p-4 text-sm text-slate-50">
						{JSON.stringify(data.users, null, 2)}
					</pre>
				</div>
			</section>

			<section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
				<div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
					<h2 className="text-xl font-semibold text-slate-700">
						Event Types ({data.eventTypes.length})
					</h2>
				</div>
				<div className="p-6">
					<pre className="overflow-auto rounded-lg bg-slate-900 p-4 text-sm text-slate-50">
						{JSON.stringify(data.eventTypes, null, 2)}
					</pre>
				</div>
			</section>

			<section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
				<div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
					<h2 className="text-xl font-semibold text-slate-700">
						Availability ({data.availability.length})
					</h2>
				</div>
				<div className="p-6">
					<pre className="overflow-auto rounded-lg bg-slate-900 p-4 text-sm text-slate-50">
						{JSON.stringify(data.availability, null, 2)}
					</pre>
				</div>
			</section>

			<section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
				<div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
					<h2 className="text-xl font-semibold text-slate-700">
						Bookings ({data.bookings.length})
					</h2>
				</div>
				<div className="p-6">
					<pre className="overflow-auto rounded-lg bg-slate-900 p-4 text-sm text-slate-50">
						{JSON.stringify(data.bookings, null, 2)}
					</pre>
				</div>
			</section>
		</div>
	);
}
