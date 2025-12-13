/**
 * Home Page - Game Discovery
 *
 * Filtering Strategy:
 * RAWG API uses OR logic for tags (tags=A,B returns games with A OR B, not A AND B).
 * This creates issues when combining user tags with multiplayer tags.
 *
 * Solution:
 * - Multiplayer-only: Pass multiplayer tags to API for proper sorting (e.g., top co-op games)
 * - User tags + Multiplayer: Pass only user tags to API, filter multiplayer client-side
 *
 * This ensures "Western Co-op games" returns games that are BOTH Western AND Co-op.
 * See GameGridWithLoadMore.tsx for client-side filtering implementation.
 */

import { Suspense } from "react";
import { Filters, SortSelect } from "@/components/Filters";
import { GameGrid } from "@/components/GameGrid";
import { GameGridWithLoadMore } from "@/components/GameGridWithLoadMore";
import { LuckyButton } from "@/components/LuckyButton";
import { SearchBar } from "@/components/SearchBar";
import {
	DEFAULT_PLATFORMS,
	MULTIPLAYER_TAGS,
	type MultiplayerMode,
} from "@/lib/constants";
import { applyFilters, getTagGroups } from "@/lib/filters";
import { getGames, getGenres } from "@/lib/rawg";
import type { Game, GameOrdering, GamesResponse } from "@/types/game";

interface HomeProps {
	searchParams: Promise<{
		genre?: string;
		ordering?: string;
		page?: string;
		dateFrom?: string;
		dateTo?: string;
		tags?: string;
		matchAllTags?: string;
		metacritic?: string;
		platform?: string;
		store?: string;
		unreleased?: string;
		lucky?: string;
		multiplayer?: string;
		search?: string;
		searchExact?: string;
	}>;
}

// Simple hash function for deterministic random from seed
function hashSeed(seed: string): number {
	let hash = 0;
	for (let i = 0; i < seed.length; i++) {
		const char = seed.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash;
	}
	return Math.abs(hash);
}

export default async function Home({ searchParams }: HomeProps) {
	const params = await searchParams;
	const isLucky = Boolean(params.lucky);
	const selectedMultiplayerMode =
		(params.multiplayer as MultiplayerMode) || null;

	// Build dates filter in RAWG format: "YYYY-MM-DD,YYYY-MM-DD"
	const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
	const oneYearFromNow = new Date(Date.now() + 365 * 86400000)
		.toISOString()
		.split("T")[0];

	let dates: string;
	if (params.unreleased === "true") {
		// Unreleased only: tomorrow to 1 year from now
		dates = `${tomorrow},${oneYearFromNow}`;
	} else if (params.dateFrom || params.dateTo) {
		// User specified dates
		const from = params.dateFrom || "1970-01-01";
		const to = params.dateTo || oneYearFromNow;
		dates = `${from},${to}`;
	} else {
		// Default: all time up to 1 year from now
		dates = `1970-01-01,${oneYearFromNow}`;
	}

	const ordering = (params.ordering || "-rating") as GameOrdering;

	// When sorting by metacritic, ensure games have a score (avoid nulls first)
	const metacriticFilter =
		params.metacritic || (ordering === "-metacritic" ? "1,100" : undefined);

	// Determine which tags to send to API:
	// - If user selected tags AND multiplayer: only send user tags (avoid RAWG's OR behavior)
	//   and filter multiplayer client-side
	// - If user selected multiplayer but NO tags: send multiplayer tags to API
	//   so we get properly sorted results (e.g., top-rated co-op games)
	// - Otherwise: just use user tags (or undefined)
	let apiTags: string | undefined;
	const matchAllTags = params.matchAllTags === "true";
	const needsClientSideMultiplayerFilter = Boolean(
		params.tags && selectedMultiplayerMode,
	);
	const needsClientSideTagFilter = Boolean(params.tags && matchAllTags);

	if (params.tags) {
		// User has tags selected - use those, multiplayer handled client-side if needed
		apiTags = params.tags;
	} else if (selectedMultiplayerMode) {
		// Only multiplayer selected - pass to API for proper sorting
		apiTags = MULTIPLAYER_TAGS[selectedMultiplayerMode].join(",");
	}

	const baseFilters = {
		ordering,
		genres: params.genre,
		// Use selected platform or default to current-gen only
		platforms: params.platform || DEFAULT_PLATFORMS,
		stores: params.store,
		dates,
		tags: apiTags,
		metacritic: metacriticFilter,
		search: params.search,
		search_exact: params.searchExact === "true" || undefined,
	};

	// Generate hint for empty results
	const getEmptyHint = () => {
		if (ordering === "-metacritic" && (params.dateFrom || params.unreleased)) {
			return "Metacritic scores are often delayed for recent games. Try sorting by Rating instead.";
		}
		return undefined;
	};

	// Generate hint for lucky empty results
	const getLuckyEmptyHint = () => {
		if (ordering === "-metacritic") {
			return "Many games lack Metacritic scores. Try sorting by Rating instead.";
		}
		if (needsClientSideTagFilter || needsClientSideMultiplayerFilter) {
			return "Your filter combination is very specific. Try removing some filters.";
		}
		return "No matching games found. Try adjusting your filters.";
	};

	let gamesData: GamesResponse;

	if (isLucky) {
		// Determine if we need client-side filtering for lucky picks
		const luckyNeedsFiltering =
			needsClientSideMultiplayerFilter || needsClientSideTagFilter;
		const luckyTagGroups = needsClientSideTagFilter
			? getTagGroups(params.tags)
			: [];
		const luckyMultiplayerMode = needsClientSideMultiplayerFilter
			? selectedMultiplayerMode
			: null;

		// Get count first to know how many pages exist
		const countData = await getGames({ ...baseFilters, page: 1, page_size: 1 });
		const pageSize = luckyNeedsFiltering ? 100 : 20;
		const maxPage = Math.min(Math.ceil(countData.count / pageSize), 500);

		let luckyGame: Game | null = null;

		if (maxPage > 0) {
			const seed = params.lucky || "default";
			const hash = hashSeed(seed);

			// Try up to 10 pages to find a matching game
			for (let attempt = 0; attempt < 10 && !luckyGame; attempt++) {
				const randomPage = ((hash + attempt * 7) % maxPage) + 1;

				const pageData = await getGames({
					...baseFilters,
					page: randomPage,
					page_size: pageSize,
				});

				let candidates = pageData.results;

				// Apply client-side filters if needed
				if (luckyNeedsFiltering) {
					candidates = applyFilters(candidates, {
						multiplayerMode: luckyMultiplayerMode,
						tagGroups: luckyTagGroups,
					});
				}

				if (candidates.length > 0) {
					// Pick a random game from filtered results
					const randomIndex = hash % candidates.length;
					luckyGame = candidates[randomIndex];
				}
			}
		}

		gamesData = {
			count: countData.count,
			results: luckyGame ? [luckyGame] : [],
			next: null,
			previous: null,
		};
	} else {
		// Fetch more results when client-side filtering is needed (to compensate for filtering losses)
		const needsMoreResults =
			needsClientSideMultiplayerFilter || needsClientSideTagFilter;
		const pageSize = needsMoreResults ? 100 : 20;
		gamesData = await getGames({
			...baseFilters,
			page: 1,
			page_size: pageSize,
		});
	}

	const genres = await getGenres();

	return (
		<div>
			<div className="mb-8">
				<h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
					{params.search ? `Results for "${params.search}"` : "Discover Games"}
				</h1>
				<p className="text-muted mb-4">
					{params.search
						? "Refine with filters below"
						: "Browse and find your next favorite game"}
				</p>
				<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
					<Suspense fallback={null}>
						<SearchBar className="sm:max-w-md flex-1" />
					</Suspense>
					<Suspense fallback={null}>
						<LuckyButton />
					</Suspense>
				</div>
			</div>

			<Suspense fallback={null}>
				<Filters genres={genres} />
			</Suspense>

			<div className="flex items-center justify-between mb-4">
				<p className="text-muted text-sm" aria-live="polite" aria-atomic="true">
					{isLucky
						? `Random pick from ${gamesData.count.toLocaleString()} games`
						: `${gamesData.count.toLocaleString()} games found`}
				</p>
				<Suspense fallback={null}>
					<SortSelect />
				</Suspense>
			</div>

			{isLucky ? (
				<GameGrid games={gamesData.results} emptyHint={getLuckyEmptyHint()} />
			) : (
				<GameGridWithLoadMore
					initialGames={gamesData.results}
					initialCount={gamesData.count}
					filters={baseFilters}
					selectedMultiplayerMode={
						needsClientSideMultiplayerFilter ? selectedMultiplayerMode : null
					}
					matchAllTags={needsClientSideTagFilter}
					emptyHint={getEmptyHint()}
				/>
			)}
		</div>
	);
}
