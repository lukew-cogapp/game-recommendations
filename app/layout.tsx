import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: {
		default: "Game Recommendations - Discover Your Next Favorite Game",
		template: "%s | Game Recommendations",
	},
	description:
		"Find game recommendations, browse popular titles, and discover new games to play. Filter by platform, genre, tags, and more.",
	openGraph: {
		type: "website",
		locale: "en_US",
		siteName: "Game Recommendations",
		title: "Game Recommendations - Discover Your Next Favorite Game",
		description:
			"Find game recommendations, browse popular titles, and discover new games to play. Filter by platform, genre, tags, and more.",
	},
	twitter: {
		card: "summary_large_image",
		title: "Game Recommendations - Discover Your Next Favorite Game",
		description:
			"Find game recommendations, browse popular titles, and discover new games to play.",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
			>
				<div className="min-w-fit">
					<a
						href="#main"
						className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-gold focus:text-background focus:rounded-lg"
					>
						Skip to main content
					</a>
					<main
						id="main"
						className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
					>
						{children}
					</main>
					<footer className="border-t border-border mt-16">
						<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-muted text-sm">
							Powered by{" "}
							<a
								href="https://rawg.io"
								target="_blank"
								rel="noopener noreferrer"
								className="text-gold hover:text-gold-hover"
							>
								RAWG.io
								<span className="sr-only"> (opens in new tab)</span>
							</a>
						</div>
					</footer>
				</div>
			</body>
		</html>
	);
}
