/**
 * Shared fetcher for SWR hooks
 * Throws on non-OK responses for SWR error handling
 */
export async function fetcher<T>(url: string): Promise<T> {
	const res = await fetch(url);
	if (!res.ok) {
		throw new Error(`Failed to fetch: ${res.status}`);
	}
	return res.json();
}
