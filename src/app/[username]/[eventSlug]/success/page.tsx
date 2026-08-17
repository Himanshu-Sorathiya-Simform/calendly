import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Button from "../../../../components/ui/Button";

interface SuccessPageProps {
	params: Promise<{ username: string; eventSlug: string }>;
}

export default async function SuccessPage({ params }: SuccessPageProps) {
	const { username } = await params;

	return (
		<main className="mx-auto flex min-h-screen flex-col items-center justify-center p-8 font-sans bg-background">
			<div className="w-full max-w-md text-center bg-white p-12 rounded-3xl shadow-xl shadow-black/5 border border-black/5 animate-in fade-in slide-in-from-bottom-4">
				<div className="flex justify-center mb-6">
					<div className="rounded-full bg-green-100 p-3">
						<CheckCircle2 className="h-12 w-12 text-green-600" />
					</div>
				</div>
				
				<h1 className="text-graphite text-3xl font-bold tracking-tight mb-4">
					You are scheduled
				</h1>
				
				<p className="text-subtle mb-8">
					A calendar invitation has been sent to your email address.
				</p>

				<Link href={`/${username}`} className="block">
					<Button variant="secondary" className="w-full">
						Return to Host Profile
					</Button>
				</Link>
			</div>
		</main>
	);
}
