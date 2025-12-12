"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export type FilterKey =
	| "genre"
	| "platform"
	| "tags"
	| "matchAllTags"
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
	const currentMatchAllTags = searchParams.get("matchAllTags") === "true";
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
			} else if (preset) {
				const today = new Date();
				const pastDate = new Date(today);
				if (preset === "6months") {
					pastDate.setMonth(today.getMonth() - 6);
				} else if (preset === "12months") {
					pastDate.setFullYear(today.getFullYear() - 1);
				} else if (preset === "2years") {
					pastDate.setFullYear(today.getFullYear() - 2);
				} else if (preset === "5years") {
					pastDate.setFullYear(today.getFullYear() - 5);
				} else if (preset === "10years") {
					pastDate.setFullYear(today.getFullYear() - 10);
				}
				params.set("dateFrom", pastDate.toISOString().split("T")[0]);
				params.set("dateTo", today.toISOString().split("T")[0]);
			}

			router.push(`/?${params.toString()}`);
		},
		[router, searchParams],
	);

	// Determine which date preset is currently active
	const getActiveDatePreset = useCallback(() => {
		if (currentUnreleased) return "unreleased";
		if (currentDateFrom && currentDateTo) {
			const from = new Date(currentDateFrom);
			const to = new Date(currentDateTo);
			const diffDays = Math.round(
				(to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24),
			);
			if (diffDays <= 190) return "6months";
			if (diffDays <= 370) return "12months";
			if (diffDays <= 740) return "2years";
			if (diffDays <= 1850) return "5years";
			if (diffDays <= 3700) return "10years";
			return "custom";
		}
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
		currentMatchAllTags ||
		currentMetacritic ||
		currentUnreleased;

	return {
		// Current filter values
		currentGenre,
		currentPlatform,
		currentDateFrom,
		currentDateTo,
		currentTags,
		currentMatchAllTags,
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
