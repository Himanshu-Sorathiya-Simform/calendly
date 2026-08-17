import { SignedIn, SignedOut, RedirectToSignIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Calendar, Clock, LayoutDashboard } from "lucide-react";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<SignedOut>
				<RedirectToSignIn />
			</SignedOut>

			<SignedIn>
				<div className="flex min-h-screen flex-col lg:flex-row">
					{/* Sidebar */}
					<aside className="bg-muted/30 flex w-full flex-col gap-6 border-r p-6 lg:w-64">
						<div className="flex items-center gap-2 text-xl font-semibold">
							<Calendar className="text-primary h-6 w-6" />
							<span>Calendly Clone</span>
						</div>

						<nav className="mt-6 flex flex-col gap-2">
							<Link
								href="/dashboard"
								className="hover:bg-muted flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium"
							>
								<LayoutDashboard className="h-4 w-4" />
								Event Types
							</Link>
							<Link
								href="/dashboard/bookings"
								className="hover:bg-muted flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium"
							>
								<Clock className="h-4 w-4" />
								Bookings
							</Link>
							<Link
								href="/dashboard/availability"
								className="hover:bg-muted flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium"
							>
								<Calendar className="h-4 w-4" />
								Availability
							</Link>
						</nav>

						<div className="mt-auto">
							<div className="hover:bg-muted flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium">
								<UserButton showName />
							</div>
						</div>
					</aside>

					{/* Main Content */}
					<main className="flex-1 p-8">{children}</main>
				</div>
			</SignedIn>
		</>
	);
}
