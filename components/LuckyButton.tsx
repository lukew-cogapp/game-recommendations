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

	if (isLucky) {
		return (
			<div className="flex gap-2">
				<Button onClick={handleClick}>Try Another</Button>
				<Button variant="secondary" onClick={handleClear}>
					Show All
				</Button>
			</div>
		);
	}

	return <Button onClick={handleClick}>I'm Feeling Lucky</Button>;
}
