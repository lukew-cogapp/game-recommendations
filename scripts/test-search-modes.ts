import { resolve } from "node:path";
import { config } from "dotenv";

// Load .env.local
config({ path: resolve(process.cwd(), ".env.local") });

const API_KEY = process.env.RAWG_API_KEY ?? "";

if (!API_KEY) {
	console.error("RAWG_API_KEY not found in .env.local");
	process.exit(1);
}

interface SearchResult {
	name: string;
	slug: string;
	released: string | null;
}

async function searchGames(
	query: string,
	options: { precise?: boolean; exact?: boolean } = {},
): Promise<{ count: number; results: SearchResult[] }> {
	const params = new URLSearchParams({
		key: API_KEY,
		search: query,
		page_size: "10",
	});

	if (options.precise) {
		params.set("search_precise", "true");
	}
	if (options.exact) {
		params.set("search_exact", "true");
	}

	const url = `https://api.rawg.io/api/games?${params.toString()}`;
	const response = await fetch(url);
	const data = await response.json();
	return {
		count: data.count,
		results: data.results.map((g: SearchResult) => ({
			name: g.name,
			slug: g.slug,
			released: g.released,
		})),
	};
}

async function testSearch(query: string) {
	console.log(`\n${"=".repeat(60)}`);
	console.log(`Testing search: "${query}"`);
	console.log("=".repeat(60));

	// Fuzzy (default)
	console.log("\n--- FUZZY (default) ---");
	const fuzzy = await searchGames(query);
	console.log(`Total results: ${fuzzy.count}`);
	for (const game of fuzzy.results.slice(0, 5)) {
		console.log(`  - ${game.name} (${game.slug})`);
	}

	// Precise
	console.log("\n--- PRECISE (search_precise=true) ---");
	const precise = await searchGames(query, { precise: true });
	console.log(`Total results: ${precise.count}`);
	for (const game of precise.results.slice(0, 5)) {
		console.log(`  - ${game.name} (${game.slug})`);
	}

	// Exact
	console.log("\n--- EXACT (search_exact=true) ---");
	const exact = await searchGames(query, { exact: true });
	console.log(`Total results: ${exact.count}`);
	for (const game of exact.results.slice(0, 5)) {
		console.log(`  - ${game.name} (${game.slug})`);
	}

	// Both
	console.log("\n--- BOTH (precise + exact) ---");
	const both = await searchGames(query, { precise: true, exact: true });
	console.log(`Total results: ${both.count}`);
	for (const game of both.results.slice(0, 5)) {
		console.log(`  - ${game.name} (${game.slug})`);
	}
}

async function main() {
	// Test with different queries to see the difference
	await testSearch("dark souls");
	await testSearch("portal");
	await testSearch("the witcher");
	await testSearch("gta"); // abbreviation
	await testSearch("half life"); // without hyphen
}

main().catch(console.error);
