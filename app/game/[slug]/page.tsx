import Link from "next/link";
import { notFound } from "next/navigation";
import { getGame, getGameScreenshots, getGameStores } from "@/lib/rawg";
import type { GameDetails } from "@/types/game";
import { GameHero } from "./GameHero";
import { GameSidebar } from "./GameSidebar";
import { ScreenshotGallery } from "./ScreenshotGallery";

interface GamePageProps {
	params: Promise<{ slug: string }>;
}

export default async function GamePage({ params }: GamePageProps) {
	const { slug } = await params;

	let game: GameDetails;
	try {
		game = await getGame(slug);
	} catch {
		notFound();
	}

	const [screenshots, stores] = await Promise.all([
		getGameScreenshots(slug).catch(() => ({ results: [] })),
		getGameStores(slug).catch(() => ({ results: [] })),
	]);

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

					<ScreenshotGallery
						screenshots={screenshots.results}
						gameName={game.name}
					/>
				</div>

				<GameSidebar game={game} stores={stores.results} />
			</div>
		</div>
	);
}
