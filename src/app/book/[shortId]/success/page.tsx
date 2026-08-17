import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Button from "../../../../components/ui/Button";

interface SuccessPageProps {
	params: Promise<{ username: string; eventSlug: string }>;
}

export default async function SuccessPage({ params }: SuccessPageProps) {
	const { username } = await params;

	return (
		<main className="bg-background mx-auto flex min-h-screen flex-col items-center justify-center p-8 font-sans">
			<div className="animate-in fade-in slide-in-from-bottom-4 w-full max-w-md rounded-3xl border border-black/5 bg-white p-12 text-center shadow-xl shadow-black/5">
				<div className="mb-6 flex justify-center">
					<div className="rounded-full bg-green-100 p-3">
						<CheckCircle2 className="h-12 w-12 text-green-600" />
					</div>
				</div>

				<h1 className="text-graphite mb-4 text-3xl font-bold tracking-tight">
					You are scheduled
				</h1>

				<p className="text-subtle mb-8">
					A calendar invitation has been sent to your email address.
				</p>

				<Link
					href={`/${username}`}
					className="block"
				>
					<Button
						variant="secondary"
						className="w-full"
					>
						Return to Host Profile
					</Button>
				</Link>
			</div>
		</main>
	);
}
