import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGame, getGameStores } from "@/lib/rawg";
import type { GameDetails } from "@/types/game";
import { GameHero } from "./GameHero";
import { GameSeries } from "./GameSeries";
import { GameSidebar } from "./GameSidebar";
import { ScreenshotGallery } from "./ScreenshotGallery";

interface GamePageProps {
	params: Promise<{ slug: string }>;
}

export async function generateMetadata({
	params,
}: GamePageProps): Promise<Metadata> {
	const { slug } = await params;

	try {
		const game = await getGame(slug);
		const description =
			game.description_raw?.slice(0, 160) ||
			`${game.name} - View details, screenshots, and where to buy.`;

		return {
			title: game.name,
			description,
			openGraph: {
				title: game.name,
				description,
				images: game.background_image
					? [
							{
								url: game.background_image,
								width: 1200,
								height: 630,
								alt: game.name,
							},
						]
					: [],
				type: "website",
			},
			twitter: {
				card: "summary_large_image",
				title: game.name,
				description,
				images: game.background_image ? [game.background_image] : [],
			},
		};
	} catch {
		return {
			title: "Game Not Found",
		};
	}
}

export default async function GamePage({ params }: GamePageProps) {
	const { slug } = await params;

	let game: GameDetails;
	try {
		game = await getGame(slug);
	} catch {
		notFound();
	}

	const stores = await getGameStores(slug).catch(() => ({ results: [] }));

	return (
		<div>
			<Link
				href="/"
				className="text-gold hover:text-gold-hover mb-6 inline-block"
			>
				&larr; Back to Browse
			</Link>

			<GameHero game={game} />

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
				<div className="lg:col-span-2 space-y-8">
					<section>
						<h2 className="text-xl font-bold text-foreground mb-4">About</h2>
						<div className="prose prose-invert max-w-none">
							<p className="text-foreground/80 leading-relaxed whitespace-pre-line">
								{game.description_raw || "No description available."}
							</p>
						</div>
					</section>

					<ScreenshotGallery slug={slug} gameName={game.name} />

					<GameSeries slug={slug} currentGameId={game.id} />
				</div>

				<GameSidebar game={game} stores={stores.results} />
			</div>
		</div>
	);
}
