"use client";

import { useEffect, useRef, useState } from "react";
import { TAG_PRESETS } from "@/lib/constants";

interface TagPickerProps {
	selectedTags: string;
	onChange: (tags: string) => void;
}

// Group tags by category
const tagsByCategory = TAG_PRESETS.reduce(
	(acc, tag) => {
		if (!acc[tag.category]) {
			acc[tag.category] = [];
		}
		acc[tag.category].push(tag);
		return acc;
	},
	{} as Record<string, (typeof TAG_PRESETS)[number][]>,
);

const categoryOrder = [
	"Multiplayer",
	"Genre",
	"Gameplay",
	"Setting",
	"Narrative",
];

export function TagPicker({ selectedTags, onChange }: TagPickerProps) {
	const [isOpen, setIsOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	// Parse selected tag IDs into a Set for quick lookup
	const selectedIdSet = new Set(
		selectedTags ? selectedTags.split(",").filter(Boolean) : [],
	);

	// Check if a tag preset is selected (all its IDs must be in selectedIdSet)
	const isTagSelected = (tagIds: string) => {
		const ids = tagIds.split(",");
		return ids.every((id) => selectedIdSet.has(id));
	};

	// Count how many tag presets are selected
	const selectedCount = TAG_PRESETS.filter((tag) =>
		isTagSelected(tag.ids),
	).length;

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const toggleTag = (tagIds: string) => {
		const idsToToggle = tagIds.split(",");
		const isCurrentlySelected = isTagSelected(tagIds);

		let newIds: string[];
		if (isCurrentlySelected) {
			// Remove all IDs from this tag preset
			newIds = [...selectedIdSet].filter((id) => !idsToToggle.includes(id));
		} else {
			// Add all IDs from this tag preset
			newIds = [...new Set([...selectedIdSet, ...idsToToggle])];
		}

		onChange(newIds.join(","));
	};

	const getSelectedLabels = () => {
		if (selectedCount === 0) return "All Tags";
		const selectedLabels = TAG_PRESETS.filter((t) => isTagSelected(t.ids)).map(
			(t) => t.label,
		);
		if (selectedLabels.length <= 2) {
			return selectedLabels.join(", ");
		}
		return `${selectedLabels.length} tags`;
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Escape" && isOpen) {
			setIsOpen(false);
		}
	};

	return (
		<div ref={ref} className="relative">
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				onKeyDown={handleKeyDown}
				aria-expanded={isOpen}
				aria-haspopup="listbox"
				aria-label={`Filter by tags: ${getSelectedLabels()}`}
				className="px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-gold cursor-pointer flex items-center gap-2 min-w-[120px]"
			>
				<span className="truncate">{getSelectedLabels()}</span>
				<svg
					className={`w-4 h-4 flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</button>

			{isOpen && (
				<div
					role="listbox"
					aria-label="Tag filters"
					className="absolute top-full left-0 mt-1 w-64 bg-card border border-border rounded-lg shadow-xl z-50 py-2 max-h-80 overflow-y-auto"
				>
					{categoryOrder.map((category) => (
						<fieldset key={category} className="border-0 p-0 m-0">
							<legend className="px-3 py-1 text-xs font-semibold text-muted uppercase tracking-wider">
								{category}
							</legend>
							{tagsByCategory[category]?.map((tag) => (
								<label
									key={tag.ids}
									className="flex items-center gap-3 px-3 py-1.5 hover:bg-card-hover cursor-pointer"
								>
									<input
										type="checkbox"
										checked={isTagSelected(tag.ids)}
										onChange={() => toggleTag(tag.ids)}
										className="w-4 h-4 rounded border-border bg-background text-gold focus:ring-gold focus:ring-offset-background accent-gold"
									/>
									<span className="text-sm text-foreground">{tag.label}</span>
								</label>
							))}
						</fieldset>
					))}
					{selectedCount > 0 && (
						<button
							type="button"
							onClick={() => onChange("")}
							className="w-full text-left px-3 py-2 text-sm text-muted hover:text-foreground hover:bg-card-hover border-t border-border mt-1"
						>
							Clear all tags
						</button>
					)}
				</div>
			)}
		</div>
	);
}
