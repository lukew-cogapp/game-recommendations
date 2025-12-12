export interface Platform {
	id: number;
	name: string;
	slug: string;
}

export interface PlatformWrapper {
	platform: Platform;
}

export interface Genre {
	id: number;
	name: string;
	slug: string;
}

export interface Tag {
	id: number;
	name: string;
	slug: string;
}

export interface Screenshot {
	id: number;
	image: string;
}

export interface Game {
	id: number;
	slug: string;
	name: string;
	released: string | null;
	background_image: string | null;
	rating: number;
	rating_top: number;
	ratings_count: number;
	metacritic: number | null;
	playtime: number;
	platforms: PlatformWrapper[] | null;
	genres: Genre[] | null;
	tags: Tag[] | null;
	short_screenshots: Screenshot[] | null;
	description_raw?: string;
}

export interface GameDetails extends Game {
	description_raw: string;
	developers: { id: number; name: string; slug: string }[];
	publishers: { id: number; name: string; slug: string }[];
	website: string;
	metacritic_url: string | null;
}

export interface GamesResponse {
	count: number;
	next: string | null;
	previous: string | null;
	results: Game[];
}

export interface GenresResponse {
	count: number;
	results: Genre[];
}

export type GameOrdering =
	| "name"
	| "-name"
	| "released"
	| "-released"
	| "added"
	| "-added"
	| "created"
	| "-created"
	| "updated"
	| "-updated"
	| "rating"
	| "-rating"
	| "metacritic"
	| "-metacritic";

export interface GameFilters {
	page?: number;
	page_size?: number;
	ordering?: GameOrdering;
	genres?: string;
	platforms?: string;
	search?: string;
	dates?: string; // Format: "YYYY-MM-DD,YYYY-MM-DD"
	tags?: string; // Comma-separated tag IDs
	metacritic?: string; // Format: "min,max" e.g. "80,100"
}
