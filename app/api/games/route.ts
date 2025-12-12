import { type NextRequest, NextResponse } from "next/server";

const RAWG_API_URL = "https://api.rawg.io/api";
const API_KEY = process.env.RAWG_API_KEY;

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;

	// Build params for RAWG API
	const rawgParams = new URLSearchParams();
	rawgParams.set("key", API_KEY || "");

	// Forward all query params except our internal ones
	for (const [key, value] of searchParams.entries()) {
		if (value) {
			rawgParams.set(key, value);
		}
	}

	const url = `${RAWG_API_URL}/games?${rawgParams.toString()}`;
	const response = await fetch(url, { next: { revalidate: 3600 } });

	if (!response.ok) {
		return NextResponse.json(
			{ error: `RAWG API error: ${response.status}` },
			{ status: response.status },
		);
	}

	const data = await response.json();
	return NextResponse.json(data);
}
