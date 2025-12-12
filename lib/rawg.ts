import type {
	GameDetails,
	GameFilters,
	GamesResponse,
	Genre,
	GenresResponse,
} from "@/types/game";
import { STORE_INFO } from "./constants";

const RAWG_API_URL = "https://api.rawg.io/api";
const API_KEY = process.env.RAWG_API_KEY;

// Fetch with Next.js Data Cache - caches for 24 hours
async function fetchRawg<T>(
	endpoint: string,
	params: Record<string, string | number | undefined> = {},
): Promise<T> {
	const searchParams = new URLSearchParams();
	searchParams.set("key", API_KEY || "");

	for (const [key, value] of Object.entries(params)) {
		if (value !== undefined) {
			searchParams.set(key, String(value));
		}
	}

	const url = `${RAWG_API_URL}${endpoint}?${searchParams.toString()}`;
	const response = await fetch(url, {
		next: { revalidate: 86400, tags: ["rawg"] },
	});

	if (!response.ok) {
		throw new Error(`RAWG API error: ${response.status}`);
	}

	return response.json();
}

export async function getGames(
	filters: GameFilters = {},
): Promise<GamesResponse> {
	return fetchRawg<GamesResponse>("/games", {
		page: filters.page,
		page_size: filters.page_size || 20,
		ordering: filters.ordering,
		genres: filters.genres,
		platforms: filters.platforms,
		search: filters.search,
		dates: filters.dates,
		tags: filters.tags,
		metacritic: filters.metacritic,
	});
}

export async function getGame(slug: string): Promise<GameDetails> {
	return fetchRawg<GameDetails>(`/games/${slug}`);
}

export async function getGameScreenshots(
	slug: string,
): Promise<{ results: { id: number; image: string }[] }> {
	return fetchRawg(`/games/${slug}/screenshots`);
}

// Raw response from RAWG stores endpoint
interface RawGameStore {
	id: number;
	url: string;
	store_id: number;
}

// Normalized store data
export interface GameStore {
	id: number;
	url: string;
	store: {
		id: number;
		name: string;
		slug: string;
	};
}

export async function getGameStores(
	slug: string,
): Promise<{ results: GameStore[] }> {
	const raw = await fetchRawg<{ results: RawGameStore[] }>(
		`/games/${slug}/stores`,
	);

	// Transform store_id to full store object
	const results = raw.results
		.filter((s) => s.url && STORE_INFO[s.store_id])
		.map((s) => ({
			id: s.id,
			url: s.url,
			store: {
				id: s.store_id,
				name: STORE_INFO[s.store_id].name,
				slug: STORE_INFO[s.store_id].slug,
			},
		}));

	return { results };
}

export async function getGenres(): Promise<Genre[]> {
	const response = await fetchRawg<GenresResponse>("/genres");
	return response.results;
}
