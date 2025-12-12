"use client";

import { useCallback, useEffect, useState } from "react";
import { MULTIPLAYER_TAGS, type MultiplayerMode } from "@/lib/constants";
import type { Game } from "@/types/game";
import { GameCard } from "./GameCard";

interface GameGridWithLoadMoreProps {
	initialGames: Game[];
	initialCount: number;
	filters: Record<string, string | undefined>;
	selectedMultiplayerMode: MultiplayerMode;
}

function filterByMultiplayer(games: Game[], mode: MultiplayerMode): Game[] {
	if (!mode) return games;

	// Get the required tag IDs for the selected mode
	const requiredTagIds = MULTIPLAYER_TAGS[mode];

	return games.filter((game) => {
		if (!game.tags) return false; // Can't verify without tag info

		const gameTagIds = new Set(game.tags.map((t) => t.id));

		// Game must have at least one of the required multiplayer tags
		return requiredTagIds.some((id) => gameTagIds.has(id));
	});
}

export function GameGridWithLoadMore({
	initialGames,
	initialCount,
	filters,
	selectedMultiplayerMode,
}: GameGridWithLoadMoreProps) {
	const [games, setGames] = useState<Game[]>(initialGames);
	const [page, setPage] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const [hasMore, setHasMore] = useState(initialGames.length < initialCount);

	// Reset state when initial data changes (e.g., filters/ordering changed)
	useEffect(() => {
		setGames(initialGames);
		setPage(1);
		setHasMore(initialGames.length < initialCount);
	}, [initialGames, initialCount]);

	// Apply filtering to displayed games
	const filteredGames = filterByMultiplayer(games, selectedMultiplayerMode);

	const loadMore = useCallback(async () => {
		setIsLoading(true);

		try {
			const nextPage = page + 1;
			// Fetch more when multiplayer filter is active (to compensate for client-side filtering)
			const pageSize = selectedMultiplayerMode ? 100 : 20;
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

			setGames((prev) => [...prev, ...data.results]);
			setPage(nextPage);
			setHasMore(data.next !== null);
		} catch (error) {
			console.error("Error loading more games:", error);
		} finally {
			setIsLoading(false);
		}
	}, [page, filters, selectedMultiplayerMode]);

	// Auto-fetch more if filtered results are below minimum threshold
	// Stop after 5 pages to avoid excessive API calls
	useEffect(() => {
		if (filteredGames.length < 8 && hasMore && !isLoading && page < 5) {
			loadMore();
		}
	}, [filteredGames.length, hasMore, isLoading, loadMore, page]);

	if (filteredGames.length === 0 && !isLoading) {
		return (
			<output className="block text-center py-12 text-muted">
				No games found
			</output>
		);
	}

	return (
		<section aria-label="Game results">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{filteredGames.map((game) => (
					<GameCard key={game.id} game={game} />
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

			{selectedMultiplayerMode && filteredGames.length < games.length && (
				<p className="mt-4 text-center text-sm text-muted">
					{games.length - filteredGames.length} games filtered by multiplayer
					preference
				</p>
			)}
		</section>
	);
}
