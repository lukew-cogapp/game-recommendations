"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui";

export function LuckyButton() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const isLucky = searchParams.has("lucky");

	const handleClick = () => {
		const params = new URLSearchParams(searchParams.toString());
		params.delete("page");
		// Add a random seed to force new result each click
		params.set("lucky", Math.random().toString(36).substring(2, 8));
		router.push(`/?${params.toString()}`);
	};

	const handleClear = () => {
		const params = new URLSearchParams(searchParams.toString());
		params.delete("lucky");
		router.push(`/?${params.toString()}`);
	};

	const DiceIcon = () => (
		<svg
			className="w-4 h-4"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			aria-hidden="true"
		>
			<rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" />
			<circle cx="8" cy="8" r="1.5" fill="currentColor" stroke="none" />
			<circle cx="16" cy="8" r="1.5" fill="currentColor" stroke="none" />
			<circle cx="8" cy="16" r="1.5" fill="currentColor" stroke="none" />
			<circle cx="16" cy="16" r="1.5" fill="currentColor" stroke="none" />
			<circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
		</svg>
	);

	if (isLucky) {
		return (
			<div className="flex gap-2">
				<Button onClick={handleClick}>
					<DiceIcon />
					Try Another
				</Button>
				<Button variant="secondary" onClick={handleClear}>
					Show All
				</Button>
			</div>
		);
	}

	return (
		<Button onClick={handleClick}>
			<DiceIcon />
			I'm Feeling Lucky
		</Button>
	);
}
