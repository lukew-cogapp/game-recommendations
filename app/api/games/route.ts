import { type NextRequest, NextResponse } from "next/server";
import { getGames } from "@/lib/rawg";
import type { GameOrdering } from "@/types/game";

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;

	try {
		const data = await getGames({
			page: searchParams.get("page")
				? Number(searchParams.get("page"))
				: undefined,
			page_size: searchParams.get("page_size")
				? Number(searchParams.get("page_size"))
				: undefined,
			ordering: (searchParams.get("ordering") as GameOrdering) || undefined,
			genres: searchParams.get("genres") || undefined,
			platforms: searchParams.get("platforms") || undefined,
			stores: searchParams.get("stores") || undefined,
			search: searchParams.get("search") || undefined,
			search_exact: searchParams.get("search_exact") === "true" || undefined,
			dates: searchParams.get("dates") || undefined,
			tags: searchParams.get("tags") || undefined,
			metacritic: searchParams.get("metacritic") || undefined,
		});

		return NextResponse.json(data, {
			headers: {
				"Cache-Control":
					"public, s-maxage=86400, stale-while-revalidate=604800",
			},
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
