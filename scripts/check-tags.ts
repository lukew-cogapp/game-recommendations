import { resolve } from "node:path";
import { config } from "dotenv";

// Load .env.local
config({ path: resolve(process.cwd(), ".env.local") });

const API_KEY = process.env.RAWG_API_KEY;

if (!API_KEY) {
	console.error("RAWG_API_KEY not found in .env.local");
	process.exit(1);
}

async function searchTags(query: string) {
	const url = `https://api.rawg.io/api/tags?key=${API_KEY}&page_size=50&search=${encodeURIComponent(query)}`;
	const response = await fetch(url);
	const data = await response.json();
	return data.results;
}

async function main() {
	console.log("Searching for co-op related tags...\n");

	const searches = ["co-op", "cooperative", "multiplayer", "local"];

	for (const query of searches) {
		console.log(`\n=== Search: "${query}" ===`);
		const tags = await searchTags(query);

		if (tags && tags.length > 0) {
			for (const tag of tags.slice(0, 10)) {
				console.log(
					`  ID: ${tag.id} | Slug: ${tag.slug} | Name: ${tag.name} | Games: ${tag.games_count}`,
				);
			}
		} else {
			console.log("  No tags found");
		}
	}
}

main().catch(console.error);
