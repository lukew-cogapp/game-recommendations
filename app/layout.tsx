import { Analytics } from "@vercel/analytics/react";
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
						<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center gap-4 text-muted text-sm">
							<span>
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
							</span>
							<span className="text-border">•</span>
							<a
								href="https://github.com/lukew-cogapp/game-recommendations"
								target="_blank"
								rel="noopener noreferrer"
								className="text-muted hover:text-foreground transition-colors"
							>
								<svg
									className="w-5 h-5"
									fill="currentColor"
									viewBox="0 0 24 24"
									aria-hidden="true"
								>
									<path
										fillRule="evenodd"
										d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
										clipRule="evenodd"
									/>
								</svg>
								<span className="sr-only">
									View source on GitHub (opens in new tab)
								</span>
							</a>
						</div>
					</footer>
				</div>
				<Analytics />
			</body>
		</html>
	);
}
