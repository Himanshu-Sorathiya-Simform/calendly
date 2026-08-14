import type { Metadata } from "next";
import { IBM_Plex_Sans, Newsreader } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
	subsets: ["latin"],
	variable: "--font-newsreader",
	display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
	weight: ["400", "500", "600", "700"],
	subsets: ["latin"],
	variable: "--font-ibm-plex",
	display: "swap",
});

export const metadata: Metadata = {
	title: "Calendly Clone",
	description: "A boutique scheduling platform.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html
			lang="en"
			className={`${newsreader.variable} ${ibmPlexSans.variable}`}
		>
			<body className="bg-background text-foreground font-sans antialiased">
				{children}
			</body>
		</html>
	);
}
