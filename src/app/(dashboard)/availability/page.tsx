import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import AvailabilityForm from "../../../components/dashboard/AvailabilityForm";
import { db } from "../../../db";
import { availability, users } from "../../../db/schema";


export default async function AvailabilityPage() {
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

	// Fetch existing availability
	const userAvailability = await db.query.availability.findMany({
		where: eq(availability.userId, user.id),
	});

	return (
		<div className="space-y-8 max-w-3xl">
			<div>
				<h1 className="text-graphite text-3xl font-bold tracking-tight">
					Availability
				</h1>
				<p className="text-subtle mt-1 text-base">
					Set your regular weekly hours.
				</p>
			</div>

			<AvailabilityForm initialAvailability={userAvailability} />
		</div>
	);
}
