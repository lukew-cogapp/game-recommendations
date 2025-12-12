import Link from "next/link";
import { InfoRow } from "@/components/ui";
import { type GameStore, STORE_ICONS } from "@/lib/rawg";
import type { GameDetails } from "@/types/game";

interface GameSidebarProps {
	game: GameDetails;
	stores: GameStore[];
}

export function GameSidebar({ game, stores }: GameSidebarProps) {
	const loadedUrl = `https://www.loaded.com/pc/games#q=${encodeURIComponent(game.name)}`;
	const rawgUrl = `https://rawg.io/games/${game.slug}`;
	const platformNames =
		game.platforms?.map((p) => p.platform.name).join(", ") || "Unknown";

	return (
		<div className="space-y-6">
			<GameInfoCard game={game} platformNames={platformNames} />
			<ExternalLinks rawgUrl={rawgUrl} metacriticUrl={game.metacritic_url} />
			<StoreLinksList stores={stores} loadedUrl={loadedUrl} />
			{game.tags && game.tags.length > 0 && <TagsList tags={game.tags} />}
		</div>
	);
}

function GameInfoCard({
	game,
	platformNames,
}: {
	game: GameDetails;
	platformNames: string;
}) {
	return (
		<div className="bg-card rounded-lg p-6 border border-border">
			<h3 className="text-lg font-semibold text-foreground mb-4">Game Info</h3>
			<dl className="space-y-3">
				<InfoRow label="Platforms">{platformNames}</InfoRow>
				{game.genres && game.genres.length > 0 && (
					<InfoRow label="Genres">
						{game.genres.map((g) => g.name).join(", ")}
					</InfoRow>
				)}
				{game.developers && game.developers.length > 0 && (
					<InfoRow label="Developer">
						{game.developers.map((d) => d.name).join(", ")}
					</InfoRow>
				)}
				{game.publishers && game.publishers.length > 0 && (
					<InfoRow label="Publisher">
						{game.publishers.map((p) => p.name).join(", ")}
					</InfoRow>
				)}
				{game.playtime > 0 && (
					<InfoRow label="Average Playtime">{game.playtime} hours</InfoRow>
				)}
				{game.website && (
					<InfoRow label="Website">
						<a
							href={game.website}
							target="_blank"
							rel="noopener noreferrer"
							className="text-gold hover:text-gold-hover break-all"
						>
							Visit Website
						</a>
					</InfoRow>
				)}
			</dl>
		</div>
	);
}

function ExternalLinks({
	rawgUrl,
	metacriticUrl,
}: {
	rawgUrl: string;
	metacriticUrl: string | null;
}) {
	return (
		<div className="bg-card rounded-lg p-6 border border-border">
			<h3 className="text-lg font-semibold text-foreground mb-4">
				Ratings & Reviews
			</h3>
			<div className="space-y-2">
				<a
					href={rawgUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center justify-between px-4 py-3 bg-border rounded-lg hover:bg-card-hover transition-colors"
				>
					<span className="text-foreground">
						View on RAWG
						<span className="sr-only"> (opens in new tab)</span>
					</span>
					<svg
						className="w-4 h-4 text-muted"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
						/>
					</svg>
				</a>
				{metacriticUrl && (
					<a
						href={metacriticUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center justify-between px-4 py-3 bg-border rounded-lg hover:bg-card-hover transition-colors"
					>
						<span className="text-foreground">
							View on Metacritic
							<span className="sr-only"> (opens in new tab)</span>
						</span>
						<svg
							className="w-4 h-4 text-muted"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
							/>
						</svg>
					</a>
				)}
			</div>
		</div>
	);
}

function StoreLinksList({
	stores,
	loadedUrl,
}: {
	stores: GameStore[];
	loadedUrl: string;
}) {
	return (
		<div className="bg-card rounded-lg p-6 border border-border">
			<h3 className="text-lg font-semibold text-foreground mb-4">
				Where to Buy
			</h3>
			<div className="space-y-2">
				{stores.map((store) => (
					<StoreLink
						key={store.id}
						url={store.url}
						name={STORE_ICONS[store.store.slug] || store.store.name}
					/>
				))}
				<StoreLink url={loadedUrl} name="Search on Loaded" variant="primary" />
				{stores.length === 0 && (
					<p className="text-muted text-sm">
						No official store links available
					</p>
				)}
			</div>
		</div>
	);
}

function StoreLink({
	url,
	name,
	variant = "default",
}: {
	url: string;
	name: string;
	variant?: "default" | "primary";
}) {
	const isPrimary = variant === "primary";
	return (
		<a
			href={url}
			target="_blank"
			rel="noopener noreferrer"
			className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
				isPrimary
					? "bg-gold hover:bg-gold-hover"
					: "bg-border hover:bg-card-hover"
			}`}
		>
			<span
				className={
					isPrimary ? "text-background font-medium" : "text-foreground"
				}
			>
				{name}
				<span className="sr-only"> (opens in new tab)</span>
			</span>
			<svg
				className={`w-4 h-4 ${isPrimary ? "text-background/70" : "text-muted"}`}
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				aria-hidden="true"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
				/>
			</svg>
		</a>
	);
}

function TagsList({ tags }: { tags: GameDetails["tags"] }) {
	return (
		<div className="bg-card rounded-lg p-6 border border-border">
			<h3 className="text-lg font-semibold text-foreground mb-4">Tags</h3>
			<div className="flex flex-wrap gap-2">
				{tags?.map((tag) => (
					<Link
						key={tag.id}
						href={`/?tags=${tag.id}`}
						className="px-3 py-1 bg-border rounded-full text-sm text-foreground hover:bg-gold hover:text-background transition-colors"
					>
						{tag.name}
					</Link>
				))}
			</div>
		</div>
	);
}
