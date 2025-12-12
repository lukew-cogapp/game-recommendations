import { redirect } from "next/navigation";

interface SearchPageProps {
	searchParams: Promise<{
		q?: string;
		ordering?: string;
	}>;
}

// Redirect to homepage with search param (search is now on homepage)
export default async function SearchPage({ searchParams }: SearchPageProps) {
	const params = await searchParams;
	const query = params.q || "";

	if (query) {
		const urlParams = new URLSearchParams();
		urlParams.set("search", query);
		if (params.ordering) {
			urlParams.set("ordering", params.ordering);
		}
		redirect(`/?${urlParams.toString()}`);
	}

	// No query - redirect to homepage
	redirect("/");
}
