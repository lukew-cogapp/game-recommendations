import { NextResponse } from "next/server";
import { getGameScreenshots } from "@/lib/rawg";

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ slug: string }> },
) {
	const { slug } = await params;

	try {
		const data = await getGameScreenshots(slug);
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
