/**
 * App Constants
 *
 * Contains tag IDs, platform mappings, and filter presets for the RAWG API.
 * Tag IDs are from RAWG and can be looked up via their /tags endpoint.
 *
 * MULTIPLAYER_TAGS: Used for the dedicated multiplayer filter. These can be
 * sent to the API directly OR used for client-side filtering depending on
 * whether user tags are also selected (see app/page.tsx for logic).
 *
 * TAG_PRESETS: Curated tag combinations for the tag picker dropdown.
 * Multiple IDs can be combined (comma-separated) when tags represent
 * the same concept (e.g., "RPG" + "role-playing").
 */

// Platform slug to short label mapping (for game cards)
export const PLATFORM_LABELS: Record<string, string> = {
	pc: "PC",
	playstation: "PS",
	xbox: "XB",
	nintendo: "NS",
	mac: "Mac",
	linux: "Lin",
};

// Tag IDs for explicit adult content (blur images)
// Explicit games have nsfw/hentai/erotic/porn - "adult" alone catches legit games like Genesis Noir
export const NSFW_TAG_IDS = new Set([312, 786, 785, 1402]); // NSFW, hentai, erotic, porn

// Multiplayer tag IDs (used for filtering)
export const MULTIPLAYER_TAGS = {
	singleplayer: [31],
	coop: [18, 9, 411], // co-op + online-co-op + cooperative
	local: [72, 75, 198], // local-multiplayer + local-co-op + split-screen
} as const;

export type MultiplayerMode = keyof typeof MULTIPLAYER_TAGS | null;

// Tag presets for filtering (grouped by category)
// IDs are combined where multiple tags represent the same concept
// Note: Multiplayer is a separate filter, not in TAG_PRESETS
export const TAG_PRESETS = [
	// Genre
	{ ids: "24,468", label: "RPG", category: "Genre" }, // rpg + role-playing
	{ ids: "97", label: "Action RPG", category: "Genre" },
	{ ids: "80,230", label: "Tactical", category: "Genre" }, // tactical + tactical-rpg
	{ ids: "639", label: "Roguelike", category: "Genre" },
	{ ids: "259", label: "Metroidvania", category: "Genre" },
	{ ids: "213,180,49967", label: "City Builder", category: "Genre" }, // city-builder + base-building + colony-sim
	{ ids: "1", label: "Survival", category: "Genre" },
	{ ids: "37", label: "Sandbox", category: "Genre" },
	{ ids: "107", label: "Family Friendly", category: "Genre" },
	{ ids: "16,17", label: "Horror", category: "Genre" }, // horror + survival-horror
	// Gameplay Style
	{ ids: "36", label: "Open World", category: "Gameplay" },
	{ ids: "102,175,101", label: "Turn-Based", category: "Gameplay" }, // turn-based + turn-based-combat + turn-based-strategy
	{ ids: "99,61", label: "Isometric", category: "Gameplay" }, // isometric + top-down
	{ ids: "6", label: "Exploration", category: "Gameplay" },
	{ ids: "125", label: "Crafting", category: "Gameplay" },
	{ ids: "49", label: "Difficult", category: "Gameplay" },
	{
		ids: "115,336,29716,6670",
		label: "Controller Support",
		category: "Gameplay",
	}, // controller + controller-support variants
	// Setting/Theme
	{ ids: "64,40", label: "Fantasy", category: "Setting" }, // fantasy + dark-fantasy
	{ ids: "32,226", label: "Sci-fi", category: "Setting" }, // sci-fi + cyberpunk
	{ ids: "43", label: "Post-apocalyptic", category: "Setting" },
	{ ids: "152", label: "Western", category: "Setting" },
	// Narrative
	{ ids: "118,583", label: "Story Rich", category: "Narrative" }, // story-rich + narrative
	{ ids: "13", label: "Atmospheric", category: "Narrative" },
	{ ids: "145", label: "Choices Matter", category: "Narrative" },
] as const;

// Metacritic score presets
export const METACRITIC_SCORES = [
	{ value: "", label: "Any Score" },
	{ value: "90,100", label: "90+" },
	{ value: "80,100", label: "80+" },
	{ value: "70,100", label: "70+" },
	{ value: "60,100", label: "60+" },
	{ value: "50,100", label: "50+" },
] as const;

export const PLATFORMS = [
	{ id: 7, name: "Nintendo Switch", slug: "nintendo-switch" },
	{ id: 4, name: "PC", slug: "pc" },
	{ id: 187, name: "PlayStation 5", slug: "playstation5" },
	{ id: 186, name: "Xbox Series S/X", slug: "xbox-series-x" },
] as const;

// Default to current-gen platforms only (no GameBoy, PS2, etc.)
export const DEFAULT_PLATFORMS = PLATFORMS.map((p) => p.id).join(",");

export const ORDERINGS = [
	{ value: "-rating", label: "Top Rated" },
	{ value: "-metacritic", label: "Metacritic" },
	{ value: "-released", label: "Release Date" },
	{ value: "-added", label: "Popularity" },
	{ value: "name", label: "Name (A-Z)" },
] as const;

export const STORE_ICONS: Record<string, string> = {
	steam: "Steam",
	"playstation-store": "PlayStation",
	"xbox-store": "Xbox",
	"apple-appstore": "App Store",
	gog: "GOG",
	nintendo: "Nintendo",
	xbox360: "Xbox 360",
	"google-play": "Google Play",
	itch: "itch.io",
	epic: "Epic Games",
};

// Map store IDs to store info (for /games/{slug}/stores endpoint)
export const STORE_INFO: Record<number, { name: string; slug: string }> = {
	1: { name: "Steam", slug: "steam" },
	2: { name: "Xbox Store", slug: "xbox-store" },
	3: { name: "PlayStation Store", slug: "playstation-store" },
	4: { name: "App Store", slug: "apple-appstore" },
	5: { name: "GOG", slug: "gog" },
	6: { name: "Nintendo Store", slug: "nintendo" },
	7: { name: "Xbox 360 Store", slug: "xbox360" },
	8: { name: "Google Play", slug: "google-play" },
	9: { name: "itch.io", slug: "itch" },
	11: { name: "Epic Games", slug: "epic" },
};
