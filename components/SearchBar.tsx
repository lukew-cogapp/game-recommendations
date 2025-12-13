"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Button } from "./ui";

interface SearchBarProps {
	placeholder?: string;
	className?: string;
}

export function SearchBar({
	placeholder = "Search games...",
	className = "",
}: SearchBarProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [query, setQuery] = useState(searchParams.get("search") || "");
	const [exact, setExact] = useState(
		searchParams.get("searchExact") === "true",
	);
	const [isPending, startTransition] = useTransition();

	// Sync input with URL when navigating (e.g., back button)
	useEffect(() => {
		setQuery(searchParams.get("search") || "");
		setExact(searchParams.get("searchExact") === "true");
	}, [searchParams]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const params = new URLSearchParams(searchParams.toString());
		params.delete("page");
		params.delete("lucky");
		if (query.trim()) {
			params.set("search", query.trim());
			if (exact) {
				params.set("searchExact", "true");
			} else {
				params.delete("searchExact");
			}
		} else {
			params.delete("search");
			params.delete("searchExact");
		}
		startTransition(() => {
			router.push(`/?${params.toString()}`);
		});
	};

	return (
		<search className={className}>
			<form onSubmit={handleSubmit} className="flex flex-wrap gap-2">
				<div className="relative w-full min-[450px]:w-auto min-[450px]:flex-1 min-[450px]:basis-48 sm:basis-64 flex items-center bg-card border border-border rounded-lg focus-within:border-gold focus-within:ring-1 focus-within:ring-gold transition-colors">
					<svg
						className="absolute left-3 w-4 h-4 text-muted pointer-events-none"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
					<label htmlFor="game-search" className="sr-only">
						Search games
					</label>
					<input
						id="game-search"
						type="search"
						value={query}
						onChange={(e) => {
							const newValue = e.target.value;
							setQuery(newValue);
							// If cleared and there's an active search, remove the search param
							if (!newValue && searchParams.get("search")) {
								const params = new URLSearchParams(searchParams.toString());
								params.delete("search");
								params.delete("searchExact");
								params.delete("page");
								router.push(`/?${params.toString()}`);
							}
						}}
						placeholder={placeholder}
						className="flex-1 px-4 py-2 pl-10 bg-transparent text-foreground placeholder-muted focus:outline-none [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-cancel-button]:h-4 [&::-webkit-search-cancel-button]:w-4 [&::-webkit-search-cancel-button]:cursor-pointer [&::-webkit-search-cancel-button]:bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23a89a88%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22M18%206L6%2018M6%206l12%2012%22%2F%3E%3C%2Fsvg%3E')]"
					/>
					<label className="flex items-center gap-1.5 px-3 border-l border-border cursor-pointer hover:bg-border/30 transition-colors">
						<input
							type="checkbox"
							checked={exact}
							onChange={(e) => setExact(e.target.checked)}
							className="w-4 h-4 accent-gold"
						/>
						<span className="text-sm text-muted whitespace-nowrap">Exact</span>
					</label>
				</div>
				<Button
					type="submit"
					disabled={isPending || !query.trim()}
					className="w-full min-[450px]:w-auto"
				>
					{isPending ? "..." : "Search"}
				</Button>
			</form>
		</search>
	);
}
