"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

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
	const [query, setQuery] = useState(searchParams.get("q") || "");
	const [isPending, startTransition] = useTransition();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (query.trim()) {
			startTransition(() => {
				router.push(`/search?q=${encodeURIComponent(query.trim())}`);
			});
		}
	};

	return (
		<search className={className}>
			<form onSubmit={handleSubmit} className="relative">
				<label htmlFor="game-search" className="sr-only">
					Search games
				</label>
				<input
					id="game-search"
					type="search"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder={placeholder}
					className="w-full px-4 py-3 pl-12 bg-card border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
				/>
				<svg
					className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted"
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
				{isPending && (
					<output
						className="absolute right-4 top-1/2 -translate-y-1/2"
						aria-label="Searching"
					>
						<div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
					</output>
				)}
			</form>
		</search>
	);
}
