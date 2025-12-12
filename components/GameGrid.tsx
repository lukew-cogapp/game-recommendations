import type { Game } from "@/types/game";
import { GameCard } from "./GameCard";
import { EmptyState } from "./ui";

interface GameGridProps {
	games: Game[];
	title?: string;
	emptyHint?: string;
}

export function GameGrid({ games, title, emptyHint }: GameGridProps) {
	if (games.length === 0) {
		return <EmptyState hint={emptyHint} />;
	}

	return (
		<section aria-label={title || "Game results"}>
			{title && (
				<h2 className="text-2xl font-bold text-foreground mb-6">{title}</h2>
			)}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{games.map((game, index) => (
					<GameCard key={game.id} game={game} priority={index < 4} />
				))}
			</div>
		</section>
	);
}
