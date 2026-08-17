import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
	subsets: ["latin"],
	variable: "--font-outfit",
	display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
	subsets: ["latin"],
	variable: "--font-plus-jakarta",
	display: "swap",
});

export const metadata: Metadata = {
	title: "Calendly Clone",
	description: "A boutique scheduling platform.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<ClerkProvider>
			<html
				lang="en"
				className={`${outfit.variable} ${plusJakartaSans.variable}`}
			>
				<body className="bg-background text-foreground font-sans antialiased">
					{children}
				</body>
			</html>
		</ClerkProvider>
	);
}
