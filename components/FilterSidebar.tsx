"use client";

import { useFilters } from "@/hooks/useFilters";
import {
	METACRITIC_SCORES,
	PLATFORM_STORES,
	PLATFORMS,
	STORES,
} from "@/lib/constants";
import type { Genre } from "@/types/game";
import { MultiplayerFilter } from "./MultiplayerFilter";
import { TagPicker } from "./TagPicker";

interface FilterSidebarProps {
	genres: Genre[];
}

const sidebarSelectClassName =
	"w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold cursor-pointer";

export function FilterSidebar({ genres }: FilterSidebarProps) {
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

	return (
		<aside className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
					Filters
				</h2>
				{hasFilters && (
					<button
						type="button"
						onClick={clearFilters}
						className="text-xs text-muted hover:text-foreground transition-colors"
					>
						Clear All
					</button>
				)}
			</div>

			<div className="space-y-3">
				<label className="block">
					<span className="block text-xs text-muted mb-1.5">Platform</span>
					<select
						value={currentPlatform}
						onChange={(e) => updateFilter("platform", e.target.value)}
						className={sidebarSelectClassName}
					>
						<option value="">All Platforms</option>
						{PLATFORMS.map((platform) => (
							<option key={platform.id} value={platform.id.toString()}>
								{platform.name}
							</option>
						))}
					</select>
				</label>

				<label className="block">
					<span className="block text-xs text-muted mb-1.5">Store</span>
					<select
						value={currentStore}
						onChange={(e) => updateFilter("store", e.target.value)}
						className={sidebarSelectClassName}
					>
						<option value="">All Stores</option>
						{availableStores.map((store) => (
							<option key={store.id} value={store.id.toString()}>
								{store.name}
							</option>
						))}
					</select>
				</label>

				<div>
					<label
						htmlFor="sidebar-players"
						className="block text-xs text-muted mb-1.5"
					>
						Players
					</label>
					<MultiplayerFilter
						id="sidebar-players"
						className={sidebarSelectClassName}
					/>
				</div>

				<label className="block">
					<span className="block text-xs text-muted mb-1.5">Genre</span>
					<select
						value={currentGenre}
						onChange={(e) => updateFilter("genre", e.target.value)}
						className={sidebarSelectClassName}
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
				</label>

				<div>
					<label
						htmlFor="sidebar-tags"
						className="block text-xs text-muted mb-1.5"
					>
						Tags
					</label>
					<TagPicker
						id="sidebar-tags"
						selectedTags={currentTags}
						onChange={(tags) => updateFilter("tags", tags)}
						matchAll={currentMatchAllTags}
						onMatchAllChange={(matchAll) =>
							updateFilter("matchAllTags", matchAll)
						}
						className={sidebarSelectClassName}
					/>
				</div>

				<label className="block">
					<span className="block text-xs text-muted mb-1.5">Metacritic</span>
					<select
						value={currentMetacritic}
						onChange={(e) => updateFilter("metacritic", e.target.value)}
						className={sidebarSelectClassName}
					>
						{METACRITIC_SCORES.map((score) => (
							<option key={score.value} value={score.value}>
								{score.label}
							</option>
						))}
					</select>
				</label>

				<label className="block">
					<span className="block text-xs text-muted mb-1.5">Release Date</span>
					<select
						value={activeDatePreset}
						onChange={(e) => applyDatePreset(e.target.value)}
						className={sidebarSelectClassName}
					>
						<option value="">All Time</option>
						<option value="6months">Last 6 Months</option>
						<option value="12months">Last 12 Months</option>
						<option value="2years">Last 2 Years</option>
						<option value="5years">Last 5 Years</option>
						<option value="10years">Last 10 Years</option>
						<option value="unreleased">Unreleased</option>
					</select>
				</label>
			</div>
		</aside>
	);
}
