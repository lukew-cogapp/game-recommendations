"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export type FilterKey =
	| "genre"
	| "platform"
	| "tags"
	| "metacritic"
	| "ordering"
	| "dateFrom"
	| "dateTo"
	| "unreleased";

export function useFilters() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const currentGenre = searchParams.get("genre") || "";
	const currentPlatform = searchParams.get("platform") || "";
	const currentDateFrom = searchParams.get("dateFrom") || "";
	const currentDateTo = searchParams.get("dateTo") || "";
	const currentTags = searchParams.get("tags") || "";
	const currentMetacritic = searchParams.get("metacritic") || "";
	const currentUnreleased = searchParams.get("unreleased") === "true";
	const currentOrdering = searchParams.get("ordering") || "-rating";

	const updateFilter = useCallback(
		(key: FilterKey, value: string | boolean) => {
			const params = new URLSearchParams(searchParams.toString());
			if (typeof value === "boolean") {
				if (value) {
					params.set(key, "true");
				} else {
					params.delete(key);
				}
			} else if (value) {
				params.set(key, value);
			} else {
				params.delete(key);
			}
			params.delete("page");
			router.push(`/?${params.toString()}`);
		},
		[router, searchParams],
	);

	const clearFilters = useCallback(() => {
		router.push("/");
	}, [router]);

	const applyDatePreset = useCallback(
		(preset: string) => {
			const params = new URLSearchParams(searchParams.toString());
			params.delete("dateFrom");
			params.delete("dateTo");
			params.delete("unreleased");
			params.delete("page");

			if (preset === "unreleased") {
				params.set("unreleased", "true");
			} else if (preset === "6months") {
				const today = new Date();
				const sixMonthsAgo = new Date(today);
				sixMonthsAgo.setMonth(today.getMonth() - 6);
				params.set("dateFrom", sixMonthsAgo.toISOString().split("T")[0]);
				params.set("dateTo", today.toISOString().split("T")[0]);
			}

			router.push(`/?${params.toString()}`);
		},
		[router, searchParams],
	);

	// Determine which date preset is currently active
	const getActiveDatePreset = useCallback(() => {
		if (currentUnreleased) return "unreleased";
		if (currentDateFrom && currentDateTo) return "6months";
		return "";
	}, [currentUnreleased, currentDateFrom, currentDateTo]);

	const activeDatePreset = getActiveDatePreset();

	const hasFilters =
		currentGenre ||
		currentOrdering !== "-rating" ||
		currentPlatform ||
		currentDateFrom ||
		currentDateTo ||
		currentTags ||
		currentMetacritic ||
		currentUnreleased;

	return {
		// Current filter values
		currentGenre,
		currentPlatform,
		currentDateFrom,
		currentDateTo,
		currentTags,
		currentMetacritic,
		currentUnreleased,
		currentOrdering,
		activeDatePreset,
		hasFilters,
		// Actions
		updateFilter,
		clearFilters,
		applyDatePreset,
	};
}
