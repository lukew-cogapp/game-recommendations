"use client";

import { useFilters } from "@/hooks/useFilters";
import {
	METACRITIC_SCORES,
	PLATFORMS,
	STORES,
	TAG_PRESETS,
} from "@/lib/constants";
import type { Genre } from "@/types/game";

interface ActiveFiltersProps {
	genres: Genre[];
}

export function ActiveFilters({ genres }: ActiveFiltersProps) {
	const {
		currentGenre,
		currentPlatform,
		currentStore,
		currentTags,
		currentMetacritic,
		activeDatePreset,
		updateFilter,
		applyDatePreset,
	} = useFilters();

	// Build active filter badges
	const activeFilters: { label: string; onRemove: () => void }[] = [];

	if (currentPlatform) {
		const platform = PLATFORMS.find((p) => p.id.toString() === currentPlatform);
		if (platform) {
			activeFilters.push({
				label: platform.name,
				onRemove: () => updateFilter("platform", ""),
			});
		}
	}

	if (currentStore) {
		const store = STORES.find((s) => s.id.toString() === currentStore);
		if (store) {
			activeFilters.push({
				label: store.name,
				onRemove: () => updateFilter("store", ""),
			});
		}
	}

	if (currentGenre) {
		const genre = genres.find((g) => g.slug === currentGenre);
		if (genre) {
			activeFilters.push({
				label: genre.name,
				onRemove: () => updateFilter("genre", ""),
			});
		}
	}

	if (currentTags) {
		const tagIds = new Set(currentTags.split(",").filter(Boolean));
		for (const preset of TAG_PRESETS) {
			const presetIds = preset.ids.split(",");
			if (presetIds.every((id) => tagIds.has(id))) {
				activeFilters.push({
					label: preset.label,
					onRemove: () => {
						const newIds = [...tagIds].filter((id) => !presetIds.includes(id));
						updateFilter("tags", newIds.join(","));
					},
				});
			}
		}
	}

	if (currentMetacritic) {
		const score = METACRITIC_SCORES.find((s) => s.value === currentMetacritic);
		if (score?.value) {
			activeFilters.push({
				label: `Metacritic ${score.label}`,
				onRemove: () => updateFilter("metacritic", ""),
			});
		}
	}

	if (activeDatePreset) {
		const dateLabels: Record<string, string> = {
			"6months": "Last 6 Months",
			"12months": "Last 12 Months",
			"2years": "Last 2 Years",
			"5years": "Last 5 Years",
			"10years": "Last 10 Years",
			unreleased: "Unreleased",
		};
		activeFilters.push({
			label: dateLabels[activeDatePreset] || activeDatePreset,
			onRemove: () => applyDatePreset(""),
		});
	}

	if (activeFilters.length === 0) {
		return null;
	}

	return (
		<div className="flex flex-wrap items-center gap-2">
			<span className="text-sm text-muted">Active:</span>
			{activeFilters.map((filter) => (
				<button
					key={filter.label}
					type="button"
					onClick={filter.onRemove}
					aria-label={`Remove ${filter.label} filter`}
					className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold/20 text-gold rounded-full text-sm hover:bg-gold/30 transition-colors group"
				>
					{filter.label}
					<svg
						className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			))}
		</div>
	);
}
