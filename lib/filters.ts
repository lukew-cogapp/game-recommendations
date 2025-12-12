/**
 * Shared filtering utilities for client-side AND filtering
 *
 * RAWG API uses OR logic for tags, so we filter client-side for AND behavior.
 */

import type { Game } from "@/types/game";
import {
	MULTIPLAYER_TAGS,
	type MultiplayerMode,
	TAG_PRESETS,
} from "./constants";

/**
 * Parse selected tag IDs into preset groups for AND filtering
 * Returns groups where each group's tags should be OR'd, and groups should be AND'd
 */
export function getTagGroups(tags: string | undefined): number[][] {
	if (!tags) return [];
	const selectedIds = new Set(tags.split(",").filter(Boolean));
	const groups: number[][] = [];

	for (const preset of TAG_PRESETS) {
		const presetIds = preset.ids.split(",");
		if (presetIds.every((id) => selectedIds.has(id))) {
			groups.push(presetIds.map(Number));
		}
	}
	return groups;
}

/**
 * Filter games by tag groups (AND between groups, OR within each group)
 */
export function filterByTagGroups(
	games: Game[],
	tagGroups: number[][],
): Game[] {
	if (tagGroups.length === 0) return games;

	return games.filter((game) => {
		if (!game.tags) return false;
		const gameTagIds = new Set(game.tags.map((t) => t.id));
		return tagGroups.every((group) => group.some((id) => gameTagIds.has(id)));
	});
}

/**
 * Filter games by multiplayer mode
 */
export function filterByMultiplayer(
	games: Game[],
	mode: MultiplayerMode,
): Game[] {
	if (!mode) return games;

	const requiredTagIds = MULTIPLAYER_TAGS[mode];

	return games.filter((game) => {
		if (!game.tags) return false;
		const gameTagIds = new Set(game.tags.map((t) => t.id));
		return requiredTagIds.some((id) => gameTagIds.has(id));
	});
}

/**
 * Apply all client-side filters to games
 */
export function applyFilters(
	games: Game[],
	options: {
		multiplayerMode: MultiplayerMode;
		tagGroups: number[][];
	},
): Game[] {
	let filtered = games;
	filtered = filterByMultiplayer(filtered, options.multiplayerMode);
	filtered = filterByTagGroups(filtered, options.tagGroups);
	return filtered;
}
