"use client";

import { useRouter, useSearchParams } from "next/navigation";

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

	if (isLucky) {
		return (
			<div className="flex gap-2">
				<button
					type="button"
					onClick={handleClick}
					className="px-4 py-2 bg-gold text-background font-medium rounded-lg hover:bg-gold-hover transition-colors"
				>
					Try Another
				</button>
				<button
					type="button"
					onClick={handleClear}
					className="px-4 py-2 bg-card border border-border text-foreground rounded-lg hover:bg-card-hover transition-colors"
				>
					Show All
				</button>
			</div>
		);
	}

	return (
		<button
			type="button"
			onClick={handleClick}
			className="px-4 py-2 bg-gold text-background font-medium rounded-lg hover:bg-gold-hover transition-colors"
		>
			I'm Feeling Lucky
		</button>
	);
}
