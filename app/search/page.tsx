import Link from "next/link";
import { GameGrid } from "@/components/GameGrid";
import { Pagination } from "@/components/Pagination";
import { DEFAULT_PLATFORMS } from "@/lib/constants";
import { searchGames } from "@/lib/rawg";

interface SearchPageProps {
	searchParams: Promise<{
		q?: string;
		page?: string;
	}>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
	const params = await searchParams;
	const query = params.q || "";
	const page = Number(params.page) || 1;

	if (!query) {
		return (
			<div className="text-center py-16">
				<h1 className="text-2xl font-bold text-foreground mb-4">
					Search Games
				</h1>
				<p className="text-muted">Enter a search term to find games</p>
			</div>
		);
	}

	const gamesData = await searchGames(query, page, DEFAULT_PLATFORMS);
	// Cap pagination to avoid RAWG API 404 errors on deep pages
	const totalPages = Math.min(Math.ceil(gamesData.count / 20), 500);

	return (
		<div>
			<div className="mb-8">
				<Link
					href="/"
					className="text-gold hover:text-gold-hover mb-4 inline-block"
				>
					&larr; Back to Browse
				</Link>
				<h1 className="text-3xl font-bold text-foreground mb-2">
					Search results for &ldquo;{query}&rdquo;
				</h1>
				<p className="text-muted">
					{gamesData.count.toLocaleString()} games found
				</p>
			</div>

			<GameGrid games={gamesData.results} />

			{totalPages > 1 && (
				<Pagination
					currentPage={page}
					totalPages={totalPages}
					baseUrl="/search"
					searchParams={{ q: query }}
				/>
			)}
		</div>
	);
}
