"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { MultiplayerMode } from "@/lib/constants";
import { Select } from "./ui";

const OPTIONS: { value: MultiplayerMode; label: string }[] = [
	{ value: null, label: "Any Players" },
	{ value: "singleplayer", label: "Singleplayer" },
	{ value: "coop", label: "Co-op" },
	{ value: "local", label: "Local Multiplayer" },
];

export function MultiplayerFilter() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const current = (searchParams.get("multiplayer") as MultiplayerMode) || null;

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const value = e.target.value || null;
		const params = new URLSearchParams(searchParams.toString());

		if (value) {
			params.set("multiplayer", value);
		} else {
			params.delete("multiplayer");
		}

		router.push(`/?${params.toString()}`);
	};

	return (
		<Select
			value={current || ""}
			onChange={handleChange}
			label="Filter by player mode"
		>
			{OPTIONS.map((option) => (
				<option key={option.value || "all"} value={option.value || ""}>
					{option.label}
				</option>
			))}
		</Select>
	);
}
