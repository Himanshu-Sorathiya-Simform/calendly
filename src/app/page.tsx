import Link from "next/link";
import Button from "../components/ui/Button";

export default function Home() {
	return (
		<main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center p-8 pb-24 font-sans">
			<h1 className="text-graphite mb-6 text-center text-4xl font-bold tracking-tight text-balance">
				Welcome to Calendly Clone
			</h1>
			<p className="text-subtle mb-12 text-center text-lg">
				A boutique scheduling platform designed for modern professionals.
			</p>

			<Link href="/demo">
				<Button variant="primary">View Demo Profile</Button>
			</Link>
		</main>
	);
}
