import Image from "next/image";
import { Badge, UnreleasedBadge } from "@/components/Badge";
import type { GameDetails } from "@/types/game";

interface GameHeroProps {
	game: GameDetails;
}

export function GameHero({ game }: GameHeroProps) {
	const isUnreleased = game.released && new Date(game.released) > new Date();

	return (
		<div className="relative rounded-xl overflow-hidden mb-8 border border-border">
			<div className="aspect-video relative">
				{game.background_image ? (
					<Image
						src={game.background_image}
						alt={game.name}
						fill
						className="object-cover"
						priority
					/>
				) : (
					<div className="absolute inset-0 bg-card flex items-center justify-center">
						<span className="text-muted">No image available</span>
					</div>
				)}
				<div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
			</div>
			<div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
				<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
					{game.name}
				</h1>
				<div className="flex flex-wrap items-center gap-4">
					{game.rating > 0 && (
						<div className="flex items-center gap-1 text-lg">
							<span className="text-gold" aria-hidden="true">
								★
							</span>
							<span className="text-foreground font-semibold">
								<span className="sr-only">Rating: </span>
								{game.rating.toFixed(1)}
							</span>
							<span className="text-muted text-sm">
								({game.ratings_count.toLocaleString()} ratings)
							</span>
						</div>
					)}
					{game.metacritic && (
						<Badge
							variant={
								game.metacritic >= 75
									? "success"
									: game.metacritic >= 50
										? "warning"
										: "danger"
							}
							size="md"
						>
							Metacritic: {game.metacritic}
						</Badge>
					)}
					{isUnreleased && <UnreleasedBadge size="md" />}
					{game.released && (
						<span className="text-foreground/80">
							{isUnreleased ? "Releases:" : "Released:"}{" "}
							{new Date(game.released).toLocaleDateString("en-US", {
								year: "numeric",
								month: "long",
								day: "numeric",
							})}
						</span>
					)}
				</div>
			</div>
		</div>
	);
}
