"use client";

import { useFilters } from "@/hooks/useFilters";
import {
	METACRITIC_SCORES,
	ORDERINGS,
	PLATFORM_STORES,
	PLATFORMS,
	STORES,
	TAG_PRESETS,
} from "@/lib/constants";
import type { Genre } from "@/types/game";
import { MultiplayerFilter } from "./MultiplayerFilter";
import { TagPicker } from "./TagPicker";
import { selectClassName } from "./ui";

interface FiltersProps {
	genres: Genre[];
}

export function Filters({ genres }: FiltersProps) {
	const {
		currentGenre,
		currentPlatform,
		currentStore,
		currentTags,
		currentMatchAllTags,
		currentMetacritic,
		activeDatePreset,
		hasFilters,
		updateFilter,
		clearFilters,
		applyDatePreset,
	} = useFilters();

	// Filter stores based on selected platform
	const availableStores = STORES.filter((store) => {
		if (!currentPlatform) return true;
		const platformId = Number.parseInt(currentPlatform, 10);
		const compatibleStores = PLATFORM_STORES[platformId];
		return !compatibleStores || compatibleStores.includes(store.id);
	});

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

	return (
		<div className="space-y-3 mb-6">
			<div className="grid grid-cols-2 min-[900px]:flex min-[900px]:flex-wrap items-center gap-2">
				<select
					value={currentPlatform}
					onChange={(e) => updateFilter("platform", e.target.value)}
					className={selectClassName}
					aria-label="Filter by platform"
				>
					<option value="">All Platforms</option>
					{PLATFORMS.map((platform) => (
						<option key={platform.id} value={platform.id.toString()}>
							{platform.name}
						</option>
					))}
				</select>

				<select
					value={currentStore}
					onChange={(e) => updateFilter("store", e.target.value)}
					className={selectClassName}
					aria-label="Filter by store"
				>
					<option value="">All Stores</option>
					{availableStores.map((store) => (
						<option key={store.id} value={store.id.toString()}>
							{store.name}
						</option>
					))}
				</select>

				<MultiplayerFilter />

				<select
					value={currentGenre}
					onChange={(e) => updateFilter("genre", e.target.value)}
					className={selectClassName}
					aria-label="Filter by genre"
				>
					<option value="">All Genres</option>
					{[...genres]
						.sort((a, b) => a.name.localeCompare(b.name))
						.map((genre) => (
							<option key={genre.id} value={genre.slug}>
								{genre.name}
							</option>
						))}
				</select>

				<TagPicker
					selectedTags={currentTags}
					onChange={(tags) => updateFilter("tags", tags)}
					matchAll={currentMatchAllTags}
					onMatchAllChange={(matchAll) =>
						updateFilter("matchAllTags", matchAll)
					}
				/>

				<select
					value={currentMetacritic}
					onChange={(e) => updateFilter("metacritic", e.target.value)}
					className={selectClassName}
					aria-label="Filter by Metacritic score"
				>
					{METACRITIC_SCORES.map((score) => (
						<option key={score.value} value={score.value}>
							Metacritic {score.label}
						</option>
					))}
				</select>

				<select
					value={activeDatePreset}
					onChange={(e) => applyDatePreset(e.target.value)}
					className={selectClassName}
					aria-label="Filter by release date"
				>
					<option value="">All Time</option>
					<option value="6months">Last 6 Months</option>
					<option value="12months">Last 12 Months</option>
					<option value="2years">Last 2 Years</option>
					<option value="5years">Last 5 Years</option>
					<option value="10years">Last 10 Years</option>
					<option value="unreleased">Unreleased</option>
				</select>

				{hasFilters && (
					<button
						type="button"
						onClick={clearFilters}
						className="col-span-2 sm:col-auto flex-none px-3 py-2 text-sm text-muted hover:text-foreground transition-colors"
					>
						Clear All
					</button>
				)}
			</div>

			{activeFilters.length > 0 && (
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
			)}
		</div>
	);
}

export function SortSelect() {
	const { currentOrdering, updateFilter } = useFilters();

	return (
		<select
			value={currentOrdering}
			onChange={(e) => updateFilter("ordering", e.target.value)}
			className="min-w-36 px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-gold cursor-pointer"
			aria-label="Sort games by"
		>
			{ORDERINGS.map((order) => (
				<option key={order.value} value={order.value}>
					{order.label}
				</option>
			))}
		</select>
	);
}
