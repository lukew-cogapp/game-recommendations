import { Suspense } from "react";
import { Filters, SortSelect } from "@/components/Filters";
import { GameGrid } from "@/components/GameGrid";
import { LuckyButton } from "@/components/LuckyButton";
import { Pagination } from "@/components/Pagination";
import { SearchBar } from "@/components/SearchBar";
import { DEFAULT_PLATFORMS } from "@/lib/constants";
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
	const page = Number(params.page) || 1;
	const ordering = (params.ordering || "-rating") as GameOrdering;
	const isLucky = Boolean(params.lucky);

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

	const baseFilters = {
		ordering,
		genres: params.genre,
		// Use selected platform or default to current-gen only
		platforms: params.platform || DEFAULT_PLATFORMS,
		dates,
		tags: params.tags,
		metacritic: params.metacritic,
	};

	let gamesData: GamesResponse;
	let totalPages = 0;

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
		gamesData = await getGames({
			...baseFilters,
			page,
			page_size: 20,
		});
		// RAWG API limits pagination - cap at 500 pages (10,000 results)
		totalPages = Math.min(Math.ceil(gamesData.count / 20), 500);
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

			<GameGrid games={gamesData.results} />

			{totalPages > 1 && (
				<Pagination
					currentPage={page}
					totalPages={totalPages}
					searchParams={params}
				/>
			)}
		</div>
	);
}
