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

import type { Metadata } from "next";
import { Suspense } from "react";
import { ActiveFilters } from "@/components/ActiveFilters";
import { FilterSidebar } from "@/components/FilterSidebar";
import { Filters, SortSelect } from "@/components/Filters";
import { GameGrid } from "@/components/GameGrid";
import { GameGridWithLoadMore } from "@/components/GameGridWithLoadMore";
import { LuckyButton } from "@/components/LuckyButton";
import { SearchBar } from "@/components/SearchBar";
import {
	DEFAULT_PLATFORMS,
	MULTIPLAYER_TAGS,
	type MultiplayerMode,
	PLATFORMS,
	STORES,
	TAG_PRESETS,
} from "@/lib/constants";
import { applyFilters, getTagGroups } from "@/lib/filters";
import { getGames, getGenres } from "@/lib/rawg";
import type { Game, GameOrdering, GamesResponse } from "@/types/game";

type SearchParams = {
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
};

// Helper to join items with commas and "and" for the last item
function naturalJoin(items: string[]): string {
	if (items.length === 0) return "";
	if (items.length === 1) return items[0];
	if (items.length === 2) return `${items[0]} & ${items[1]}`;
	return `${items.slice(0, -1).join(", ")} & ${items[items.length - 1]}`;
}

// Build dynamic metadata based on search params
export async function generateMetadata({
	searchParams,
}: {
	searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
	const params = await searchParams;

	// Search term takes priority
	if (params.search) {
		const title = `Results for "${params.search}" | Game Recommendations`;
		const description = `Find games matching "${params.search}". Browse and filter by platform, genre, tags, and more.`;
		return {
			title,
			description,
			openGraph: { title, description },
			twitter: { title, description },
		};
	}

	// Collect filter info
	const descriptors: string[] = [];
	const filters: string[] = [];

	// Multiplayer mode
	if (params.multiplayer) {
		const modeLabels: Record<string, string> = {
			singleplayer: "Singleplayer",
			coop: "Co-op",
			local: "Local Multiplayer",
		};
		if (modeLabels[params.multiplayer]) {
			descriptors.push(modeLabels[params.multiplayer]);
		}
	}

	// Tags (up to 3 for title)
	const matchedTags: string[] = [];
	if (params.tags) {
		const tagIds = new Set(params.tags.split(","));
		for (const preset of TAG_PRESETS) {
			const presetIds = preset.ids.split(",");
			if (presetIds.every((id) => tagIds.has(id))) {
				matchedTags.push(preset.label);
			}
		}
		descriptors.push(...matchedTags.slice(0, 3));
	}

	// Genre
	let genreName: string | null = null;
	if (params.genre) {
		const genres = await getGenres();
		const genre = genres.find((g) => g.slug === params.genre);
		if (genre) {
			genreName = genre.name;
			descriptors.push(genre.name);
		}
	}

	// Platform
	let platformName: string | null = null;
	if (params.platform) {
		const platform = PLATFORMS.find((p) => p.id.toString() === params.platform);
		if (platform) {
			platformName = platform.name;
			filters.push(`on ${platform.name}`);
		}
	}

	// Store
	let storeName: string | null = null;
	if (params.store) {
		const store = STORES.find((s) => s.id.toString() === params.store);
		if (store) {
			storeName = store.name;
			filters.push(`on ${store.name}`);
		}
	}

	// Metacritic
	if (params.metacritic) {
		const [min] = params.metacritic.split(",");
		if (min && min !== "1") {
			filters.push(`rated ${min}+`);
		}
	}

	// Unreleased
	if (params.unreleased === "true") {
		filters.push("upcoming releases");
	}

	// If no filters, return default
	if (descriptors.length === 0 && filters.length === 0) {
		return {
			title: "Discover Games | Game Recommendations",
			description:
				"Browse and find your next favorite game. Filter by platform, genre, tags, Metacritic score, and more.",
		};
	}

	// Build title: "Action RPG & CRPG Action Games on Steam | Game Recommendations"
	let title = "";
	if (descriptors.length > 0) {
		title = `${naturalJoin(descriptors)} Games`;
	} else {
		title = "Games";
	}
	if (filters.length > 0) {
		title += ` ${filters.join(", ")}`;
	}
	title += " | Game Recommendations";

	// Build description with all details
	const descParts: string[] = [];
	if (matchedTags.length > 0) {
		descParts.push(`tagged ${naturalJoin(matchedTags)}`);
	}
	if (genreName) {
		descParts.push(`in the ${genreName} genre`);
	}
	if (platformName) {
		descParts.push(`on ${platformName}`);
	}
	if (storeName) {
		descParts.push(`available on ${storeName}`);
	}
	if (params.metacritic) {
		const [min] = params.metacritic.split(",");
		if (min && min !== "1") {
			descParts.push(`with Metacritic scores of ${min}+`);
		}
	}
	if (params.unreleased === "true") {
		descParts.push("coming soon");
	}

	const description =
		descParts.length > 0
			? `Discover games ${descParts.join(", ")}. Find your next favorite game.`
			: "Browse and find your next favorite game. Filter by platform, genre, tags, and more.";

	return {
		title,
		description,
		openGraph: { title, description },
		twitter: { title, description },
	};
}

interface HomeProps {
	searchParams: Promise<SearchParams>;
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

	const ordering = (params.ordering || "") as GameOrdering;

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
		ordering: ordering || undefined, // Empty string = relevance (don't send to API)
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
			{/* Header - full width above sidebar */}
			<div className="mb-6">
				<div className="flex items-center gap-3 mb-2">
					<h1 className="text-3xl sm:text-4xl font-bold text-foreground">
						{params.search ? (
							`Results for "${params.search}"`
						) : (
							<a href="/" className="hover:text-gold transition-colors">
								Discover Games
							</a>
						)}
					</h1>
					<span className="px-1.5 py-0.5 text-xs font-semibold uppercase tracking-wide bg-gold/20 text-gold rounded">
						Alpha
					</span>
				</div>
				<p className="text-muted">
					{params.search
						? "Refine with filters below"
						: "Browse and find your next favorite game"}
				</p>
			</div>

			{/* Sidebar + Main content */}
			<div className="flex flex-col lg:flex-row gap-8">
				{/* Sidebar - Desktop only */}
				<div className="hidden lg:block w-56 flex-shrink-0">
					<div className="sticky top-8">
						<Suspense fallback={null}>
							<FilterSidebar genres={genres} />
						</Suspense>
					</div>
				</div>

				{/* Main content */}
				<div className="flex-1 min-w-0">
					<h2 className="hidden lg:block text-sm font-semibold text-foreground uppercase tracking-wide mb-3">
						Search
					</h2>
					<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
						<Suspense fallback={null}>
							<SearchBar className="sm:max-w-xl flex-1" />
						</Suspense>
						<Suspense fallback={null}>
							<LuckyButton />
						</Suspense>
					</div>

					{/* Active filters - Desktop only */}
					<div className="hidden lg:block mb-6">
						<Suspense fallback={null}>
							<ActiveFilters genres={genres} />
						</Suspense>
					</div>

					{/* Mobile/Tablet filters */}
					<div className="lg:hidden">
						<Suspense fallback={null}>
							<Filters genres={genres} />
						</Suspense>
					</div>

					<div className="flex items-center gap-4 mb-4">
						<div className="flex items-center gap-2">
							<label htmlFor="sort-select" className="text-sm text-muted">
								Sort by
							</label>
							<Suspense fallback={null}>
								<SortSelect id="sort-select" />
							</Suspense>
						</div>
						<p
							className="text-muted text-sm"
							aria-live="polite"
							aria-atomic="true"
						>
							{(() => {
								const count = gamesData.count.toLocaleString();
								const label = gamesData.count === 1 ? "game" : "games";
								return isLucky
									? `Random pick from ${count} ${label}`
									: `${count} ${label} found`;
							})()}
						</p>
					</div>

					{isLucky ? (
						<GameGrid
							games={gamesData.results}
							emptyHint={getLuckyEmptyHint()}
						/>
					) : (
						<GameGridWithLoadMore
							initialGames={gamesData.results}
							initialCount={gamesData.count}
							filters={baseFilters}
							selectedMultiplayerMode={
								needsClientSideMultiplayerFilter
									? selectedMultiplayerMode
									: null
							}
							matchAllTags={needsClientSideTagFilter}
							emptyHint={getEmptyHint()}
						/>
					)}
				</div>
			</div>
		</div>
	);
}
