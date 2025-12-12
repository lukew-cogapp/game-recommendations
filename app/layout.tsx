import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { Suspense } from "react";
import { SearchBar } from "@/components/SearchBar";
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
	title: "Game Finder - Discover Your Next Favorite Game",
	description:
		"Find game recommendations, browse popular titles, and discover new games to play",
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
				<a
					href="#main"
					className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-gold focus:text-background focus:rounded-lg"
				>
					Skip to main content
				</a>
				<header className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border">
					<nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex items-center justify-between h-16 gap-4">
							<Link
								href="/"
								className="flex-shrink-0 text-xl font-bold text-gold hover:text-gold-hover transition-colors"
							>
								GameFinder
							</Link>
							<div className="flex-1 max-w-xl">
								<Suspense fallback={null}>
									<SearchBar />
								</Suspense>
							</div>
						</div>
					</nav>
				</header>
				<main id="main" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
			</body>
		</html>
	);
}
