import Image from "next/image";
import Link from "next/link";
import { NSFW_TAG_IDS, PLATFORM_LABELS } from "@/lib/constants";
import type { Game } from "@/types/game";
import { MetacriticBadge, PlatformBadge, UnreleasedBadge } from "./Badge";

interface GameCardProps {
	game: Game;
}

function getPlatformLabels(platforms: Game["platforms"]) {
	if (!platforms) return [];
	const seen = new Set<string>();
	return platforms
		.map((p) => {
			const slug = p.platform.slug.toLowerCase();
			for (const [key, label] of Object.entries(PLATFORM_LABELS)) {
				if (slug.includes(key) && !seen.has(label)) {
					seen.add(label);
					return label;
				}
			}
			return null;
		})
		.filter((label): label is string => label !== null);
}

function hasNsfwTags(tags: Game["tags"]): boolean {
	if (!tags) return false;
	return tags.some((tag) => NSFW_TAG_IDS.has(tag.id));
}

export function GameCard({ game }: GameCardProps) {
	const isUnreleased = game.released && new Date(game.released) > new Date();
	const isNsfw = hasNsfwTags(game.tags);

	const platformLabels = getPlatformLabels(game.platforms);

	return (
		<Link href={`/game/${game.slug}`} className="group block">
			<div className="bg-card rounded-lg overflow-hidden transition-transform group-hover:scale-[1.02] group-hover:shadow-xl border border-border">
				<div className="relative aspect-video bg-brown-dark">
					{game.background_image ? (
						<Image
							src={game.background_image}
							alt={game.name}
							fill
							className={`object-cover ${isNsfw ? "blur-xl" : ""}`}
							sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
						/>
					) : (
						<div className="absolute inset-0 flex items-center justify-center text-muted">
							No Image
						</div>
					)}
					{isNsfw && (
						<div className="absolute inset-0 flex items-center justify-center bg-background/50">
							<span className="text-sm text-muted">Mature Content</span>
						</div>
					)}
					{isUnreleased && (
						<div className="absolute top-2 right-2">
							<UnreleasedBadge />
						</div>
					)}
				</div>
				<div className="p-4">
					<div className="flex items-center gap-2 mb-2">
						{platformLabels.map((label) => (
							<PlatformBadge key={label} label={label} />
						))}
					</div>
					<h3 className="font-semibold text-foreground group-hover:text-gold transition-colors line-clamp-1">
						{game.name}
					</h3>
					<div className="flex items-center gap-3 mt-2 text-sm text-muted">
						{game.rating > 0 && (
							<span className="flex items-center gap-1">
								<span className="text-gold" aria-hidden="true">
									★
								</span>
								<span className="sr-only">Rating:</span>
								{game.rating.toFixed(1)}
								{game.ratings_count > 0 && (
									<span className="text-muted">
										({game.ratings_count.toLocaleString()})
									</span>
								)}
							</span>
						)}
						{game.metacritic && <MetacriticBadge score={game.metacritic} />}
						{game.playtime > 0 && (
							<span title={`${game.playtime} hours average playtime`}>
								{game.playtime}h
							</span>
						)}
						{game.released && (
							<span>
								{new Date(game.released).toLocaleDateString("en-US", {
									month: "short",
									year: "numeric",
								})}
							</span>
						)}
					</div>
					{game.genres && game.genres.length > 0 && (
						<div className="mt-2 flex flex-wrap gap-1">
							{game.genres.slice(0, 2).map((genre) => (
								<span key={genre.id} className="text-xs text-muted">
									{genre.name}
								</span>
							))}
						</div>
					)}
				</div>
			</div>
		</Link>
	);
}
