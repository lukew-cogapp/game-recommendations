/**
 * GameGridWithLoadMore - Paginated game grid with client-side filtering
 *
 * This component handles:
 * 1. Displaying games in a grid layout
 * 2. "Load More" pagination via client-side API calls
 * 3. Client-side multiplayer filtering (when user tags + multiplayer are both selected)
 * 4. Client-side AND filtering for tag presets (when matchAllTags is enabled)
 * 5. Auto-fetching more results when filtered count drops below 8 games
 *
 * Client-side filtering is needed because RAWG uses OR logic for tags.
 * - selectedMultiplayerMode: filters to games with at least one multiplayer tag
 * - matchAllTags: enables AND filtering between tag presets (OR within each preset)
 *   e.g., selecting RPG + Western requires (tag 24 OR 468) AND (tag 152)
 *
 * Page size is increased to 100 when filtering is active to compensate for
 * games removed by the filter. Auto-fetch stops after 10 pages.
 */

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { MultiplayerMode } from "@/lib/constants";
import {
	filterByMultiplayer,
	filterByTagGroups,
	getTagGroups,
} from "@/lib/filters";
import type { Game } from "@/types/game";
import { GameCard } from "./GameCard";
import { EmptyState } from "./ui";

interface GameGridWithLoadMoreProps {
	initialGames: Game[];
	initialCount: number;
	filters: Record<string, string | undefined>;
	selectedMultiplayerMode: MultiplayerMode;
	/** Enable AND filtering between tag presets (OR within each preset) */
	matchAllTags: boolean;
	emptyHint?: string;
}

export function GameGridWithLoadMore({
	initialGames,
	initialCount,
	filters,
	selectedMultiplayerMode,
	matchAllTags,
	emptyHint,
}: GameGridWithLoadMoreProps) {
	const [games, setGames] = useState<Game[]>(initialGames);
	const [page, setPage] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const [hasMore, setHasMore] = useState(initialGames.length < initialCount);

	// Parse tag groups when matchAllTags is enabled
	const tagGroups = useMemo(
		() => (matchAllTags ? getTagGroups(filters.tags) : []),
		[matchAllTags, filters.tags],
	);

	// Reset state when initial data changes (e.g., filters/ordering changed)
	useEffect(() => {
		setGames(initialGames);
		setPage(1);
		setHasMore(initialGames.length < initialCount);
	}, [initialGames, initialCount]);

	// Apply filtering to displayed games
	const filteredGames = filterByTagGroups(
		filterByMultiplayer(games, selectedMultiplayerMode),
		tagGroups,
	);

	const loadMore = useCallback(async () => {
		setIsLoading(true);

		try {
			const nextPage = page + 1;
			// Fetch more when client-side filtering is active
			const needsMoreResults = selectedMultiplayerMode || tagGroups.length > 0;
			const pageSize = needsMoreResults ? 100 : 20;
			const params = new URLSearchParams();

			// Add all current filters
			for (const [key, value] of Object.entries(filters)) {
				if (value) {
					params.set(key, value);
				}
			}
			params.set("page", String(nextPage));
			params.set("page_size", String(pageSize));

			const response = await fetch(`/api/games?${params.toString()}`);
			if (!response.ok) throw new Error("Failed to fetch games");

			const data = await response.json();

			setGames((prev) => {
				const existingIds = new Set(prev.map((g) => g.id));
				const newGames = data.results.filter(
					(g: Game) => !existingIds.has(g.id),
				);
				return [...prev, ...newGames];
			});
			setPage(nextPage);
			setHasMore(data.next !== null);
		} catch (error) {
			console.error("Error loading more games:", error);
		} finally {
			setIsLoading(false);
		}
	}, [page, filters, selectedMultiplayerMode, tagGroups]);

	// Auto-fetch more if filtered results are below minimum threshold
	// Stop after 20 pages to avoid excessive API calls
	useEffect(() => {
		if (filteredGames.length < 8 && hasMore && !isLoading && page < 20) {
			loadMore();
		}
	}, [filteredGames.length, hasMore, isLoading, loadMore, page]);

	if (filteredGames.length === 0 && !isLoading) {
		return <EmptyState hint={emptyHint} />;
	}

	return (
		<section aria-label="Game results">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{filteredGames.map((game, index) => (
					<GameCard key={game.id} game={game} priority={index < 4} />
				))}
			</div>

			{hasMore && (
				<div className="mt-8 text-center">
					<button
						type="button"
						onClick={loadMore}
						disabled={isLoading}
						className="px-6 py-3 bg-gold text-background font-medium rounded-lg hover:bg-gold-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isLoading ? "Loading..." : "Load More"}
					</button>
				</div>
			)}

			{(selectedMultiplayerMode || tagGroups.length > 0) &&
				filteredGames.length < games.length && (
					<p className="mt-4 text-center text-sm text-muted">
						{games.length - filteredGames.length} games filtered by{" "}
						{selectedMultiplayerMode && tagGroups.length
							? "multiplayer and tag"
							: selectedMultiplayerMode
								? "multiplayer"
								: "tag"}{" "}
						preferences
					</p>
				)}
		</section>
	);
}
