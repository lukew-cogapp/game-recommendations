"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

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
	const [isPending, startTransition] = useTransition();

	// Sync input with URL when navigating (e.g., back button)
	useEffect(() => {
		setQuery(searchParams.get("search") || "");
	}, [searchParams]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const params = new URLSearchParams(searchParams.toString());
		params.delete("page");
		params.delete("lucky");
		if (query.trim()) {
			params.set("search", query.trim());
		} else {
			params.delete("search");
		}
		startTransition(() => {
			router.push(`/?${params.toString()}`);
		});
	};

	return (
		<search className={className}>
			<form onSubmit={handleSubmit} className="flex gap-2">
				<div className="relative flex-1">
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
								params.delete("page");
								router.push(`/?${params.toString()}`);
							}
						}}
						placeholder={placeholder}
						className="w-full px-4 py-2 pl-10 bg-card border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-cancel-button]:h-4 [&::-webkit-search-cancel-button]:w-4 [&::-webkit-search-cancel-button]:cursor-pointer [&::-webkit-search-cancel-button]:bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23a89a88%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22M18%206L6%2018M6%206l12%2012%22%2F%3E%3C%2Fsvg%3E')]"
					/>
					<svg
						className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"
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
				</div>
				<button
					type="submit"
					disabled={isPending || !query.trim()}
					className="px-4 py-2 bg-gold text-background font-medium rounded-lg hover:bg-gold-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{isPending ? "..." : "Search"}
				</button>
			</form>
		</search>
	);
}
