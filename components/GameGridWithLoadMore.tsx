/**
 * GameGridWithLoadMore - Paginated game grid with client-side filtering
 *
 * This component handles:
 * 1. Displaying games in a grid layout
 * 2. "Load More" pagination via useSWRInfinite
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

import { useEffect, useMemo } from "react";
import useSWRInfinite from "swr/infinite";
import type { MultiplayerMode } from "@/lib/constants";
import { fetcher } from "@/lib/fetcher";
import {
	filterByMultiplayer,
	filterByTagGroups,
	getTagGroups,
} from "@/lib/filters";
import type { Game, GamesResponse } from "@/types/game";
import { GameCard } from "./GameCard";
import { Button, EmptyState, GameCardSkeletonGrid } from "./ui";

interface GameGridWithLoadMoreProps {
	initialGames: Game[];
	initialCount: number;
	filters: Record<string, string | boolean | undefined>;
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
	// Parse tag groups when matchAllTags is enabled
	const tagGroups = useMemo(
		() =>
			matchAllTags
				? getTagGroups(
						typeof filters.tags === "string" ? filters.tags : undefined,
					)
				: [],
		[matchAllTags, filters.tags],
	);

	// Determine page size based on filtering needs
	const needsMoreResults = selectedMultiplayerMode || tagGroups.length > 0;
	const pageSize = needsMoreResults ? 100 : 20;

	// Build query string from filters
	const buildQueryString = (pageIndex: number) => {
		const params = new URLSearchParams();
		for (const [key, value] of Object.entries(filters)) {
			if (value !== undefined && value !== false) {
				params.set(key, String(value));
			}
		}
		params.set("page", String(pageIndex + 1)); // SWR uses 0-indexed, API uses 1-indexed
		params.set("page_size", String(pageSize));
		return params.toString();
	};

	// SWR Infinite key function
	const getKey = (
		pageIndex: number,
		previousPageData: GamesResponse | null,
	) => {
		// Stop fetching if we've reached the end
		if (previousPageData && !previousPageData.next) return null;
		// Stop after 20 pages to avoid excessive API calls
		if (pageIndex >= 20) return null;
		return `/api/games?${buildQueryString(pageIndex)}`;
	};

	const {
		data: pages,
		error,
		isLoading,
		isValidating,
		size,
		setSize,
	} = useSWRInfinite<GamesResponse>(getKey, fetcher, {
		fallbackData: [
			{
				count: initialCount,
				next: initialCount > pageSize ? "more" : null,
				previous: null,
				results: initialGames,
			},
		],
		revalidateFirstPage: false,
		revalidateOnFocus: false,
	});

	// Flatten all pages into a single array of unique games
	const allGames = useMemo(() => {
		if (!pages) return [];
		const seen = new Set<number>();
		const games: Game[] = [];
		for (const page of pages) {
			for (const game of page.results) {
				if (!seen.has(game.id)) {
					seen.add(game.id);
					games.push(game);
				}
			}
		}
		return games;
	}, [pages]);

	// Apply client-side filtering
	const filteredGames = useMemo(
		() =>
			filterByTagGroups(
				filterByMultiplayer(allGames, selectedMultiplayerMode),
				tagGroups,
			),
		[allGames, selectedMultiplayerMode, tagGroups],
	);

	// Check if there are more pages to load
	const lastPage = pages?.[pages.length - 1];
	const hasMore = lastPage?.next !== null && size < 20;

	// Auto-fetch more if filtered results are below minimum threshold
	useEffect(() => {
		if (filteredGames.length < 8 && hasMore && !isValidating) {
			setSize((s) => s + 1);
		}
	}, [filteredGames.length, hasMore, isValidating, setSize]);

	const loadMore = () => {
		if (!isValidating && hasMore) {
			setSize((s) => s + 1);
		}
	};

	// Show skeleton on initial load only
	if (isLoading && !pages) {
		return <GameCardSkeletonGrid count={8} />;
	}

	if (error) {
		return (
			<div className="text-center py-12">
				<p className="text-red-400 mb-4">Failed to load games</p>
				<Button onClick={() => setSize(1)}>Try Again</Button>
			</div>
		);
	}

	if (filteredGames.length === 0 && !isValidating) {
		return <EmptyState hint={emptyHint} />;
	}

	return (
		<section aria-label="Game results">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
				{filteredGames.map((game, index) => (
					<GameCard key={game.id} game={game} priority={index < 4} />
				))}
			</div>

			{hasMore && (
				<div className="mt-8 text-center">
					<Button size="lg" onClick={loadMore} disabled={isValidating}>
						{isValidating ? "Loading..." : "Load More"}
					</Button>
				</div>
			)}

			{(selectedMultiplayerMode || tagGroups.length > 0) &&
				filteredGames.length < allGames.length && (
					<p className="mt-4 text-center text-sm text-muted">
						{allGames.length - filteredGames.length} games filtered by{" "}
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
