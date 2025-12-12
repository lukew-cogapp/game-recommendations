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
import { getGames, getGenres } from "@/lib/rawg";
import type { GameOrdering, GamesResponse } from "@/types/game";

interface HomeProps {
	searchParams: Promise<{
		genre?: string;
		ordering?: string;
		page?: string;
		dateFrom?: string;
		dateTo?: string;
		tags?: string;
		metacritic?: string;
		platform?: string;
		unreleased?: string;
		lucky?: string;
		multiplayer?: string;
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
	const ordering = (params.ordering || "-metacritic") as GameOrdering;
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
	const needsClientSideMultiplayerFilter = Boolean(
		params.tags && selectedMultiplayerMode,
	);

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
		dates,
		tags: apiTags,
		metacritic: metacriticFilter,
	};

	let gamesData: GamesResponse;

	if (isLucky) {
		// Get count first to know how many pages exist
		const countData = await getGames({ ...baseFilters, page: 1, page_size: 1 });
		const maxPage = Math.min(Math.ceil(countData.count / 20), 500);

		if (maxPage > 0) {
			// Use seed to pick a deterministic but "random" page
			const seed = params.lucky || "default";
			const hash = hashSeed(seed);
			const randomPage = (hash % maxPage) + 1;

			// Fetch that page
			const pageData = await getGames({
				...baseFilters,
				page: randomPage,
				page_size: 20,
			});

			// Pick a random game from the page
			const randomIndex = hash % pageData.results.length;
			gamesData = {
				count: countData.count,
				results:
					pageData.results.length > 0 ? [pageData.results[randomIndex]] : [],
				next: null,
				previous: null,
			};
		} else {
			gamesData = { count: 0, results: [], next: null, previous: null };
		}
	} else {
		// Fetch more results when client-side filtering is needed (to compensate for filtering losses)
		const pageSize = needsClientSideMultiplayerFilter ? 100 : 20;
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
					Discover Games
				</h1>
				<p className="text-muted mb-4">
					Browse and find your next favorite game
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
				<GameGrid games={gamesData.results} />
			) : (
				<GameGridWithLoadMore
					initialGames={gamesData.results}
					initialCount={gamesData.count}
					filters={baseFilters}
					selectedMultiplayerMode={
						needsClientSideMultiplayerFilter ? selectedMultiplayerMode : null
					}
				/>
			)}
		</div>
	);
}
