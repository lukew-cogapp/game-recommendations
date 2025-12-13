"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { SeriesSkeletonRow } from "@/components/ui";
import { fetcher } from "@/lib/fetcher";
import type { Game } from "@/types/game";

interface GameSeriesProps {
	slug: string;
	currentGameId: number;
}

export function GameSeries({ slug, currentGameId }: GameSeriesProps) {
	const [shouldLoad, setShouldLoad] = useState(false);
	const containerRef = useRef<HTMLElement>(null);

	const { data, isLoading, error } = useSWR<{ results: Game[] }>(
		shouldLoad ? `/api/games/${slug}/series` : null,
		fetcher,
	);

	const games = (data?.results || []).filter((g) => g.id !== currentGameId);

	useEffect(() => {
		const container = containerRef.current;
		if (!container || shouldLoad) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					setShouldLoad(true);
					observer.disconnect();
				}
			},
			{ rootMargin: "100px" },
		);

		observer.observe(container);

		return () => observer.disconnect();
	}, [shouldLoad]);

	// Don't render anything if loaded and no series games found
	if (shouldLoad && !isLoading && games.length === 0) return null;
	if (error) return null;

	return (
		<section ref={containerRef} className="mt-8">
			{(isLoading || games.length > 0) && (
				<>
					<h2 className="text-xl font-bold text-foreground mb-4">
						More in Series
					</h2>
					{isLoading ? (
						<SeriesSkeletonRow />
					) : (
						<div className="flex gap-4 overflow-x-auto pb-2">
							{games.map((game) => (
								<Link
									key={game.id}
									href={`/game/${game.slug}`}
									className="flex-shrink-0 w-48 bg-card rounded-lg overflow-hidden border border-border hover:border-gold transition-colors group"
								>
									<div className="relative aspect-video bg-brown-dark">
										{game.background_image ? (
											<Image
												src={game.background_image}
												alt={game.name}
												fill
												className="object-cover"
												sizes="192px"
											/>
										) : (
											<div className="absolute inset-0 flex items-center justify-center text-muted text-sm">
												No Image
											</div>
										)}
									</div>
									<div className="p-3">
										<h3 className="font-medium text-foreground group-hover:text-gold transition-colors line-clamp-2 text-sm">
											{game.name}
										</h3>
										<div className="flex items-center gap-2 mt-1 text-xs text-muted">
											{game.rating > 0 && (
												<span className="flex items-center gap-0.5">
													<span className="text-gold" aria-hidden="true">
														★
													</span>
													{game.rating.toFixed(1)}
												</span>
											)}
											{game.released && (
												<span>{new Date(game.released).getFullYear()}</span>
											)}
										</div>
									</div>
								</Link>
							))}
						</div>
					)}
				</>
			)}
		</section>
	);
}
