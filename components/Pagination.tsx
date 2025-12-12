interface PaginationProps {
	currentPage: number;
	totalPages: number;
	baseUrl?: string;
	searchParams?: Record<string, string | undefined>;
}

export function Pagination({
	currentPage,
	totalPages,
	baseUrl = "/",
	searchParams = {},
}: PaginationProps) {
	const createPageUrl = (page: number) => {
		const params = new URLSearchParams();
		for (const [key, value] of Object.entries(searchParams)) {
			if (value && key !== "page") {
				params.set(key, value);
			}
		}
		params.set("page", page.toString());
		return `${baseUrl}?${params.toString()}`;
	};

	const maxVisible = 5;
	const pages: (number | string)[] = [];

	if (totalPages <= maxVisible) {
		for (let i = 1; i <= totalPages; i++) {
			pages.push(i);
		}
	} else {
		pages.push(1);
		if (currentPage > 3) {
			pages.push("...");
		}
		for (
			let i = Math.max(2, currentPage - 1);
			i <= Math.min(totalPages - 1, currentPage + 1);
			i++
		) {
			pages.push(i);
		}
		if (currentPage < totalPages - 2) {
			pages.push("...");
		}
		pages.push(totalPages);
	}

	return (
		<nav
			aria-label="Pagination"
			className="flex items-center justify-center gap-2 mt-12"
		>
			{currentPage > 1 && (
				<a
					href={createPageUrl(currentPage - 1)}
					aria-label="Go to previous page"
					className="px-4 py-2 bg-card border border-border rounded-lg text-foreground hover:bg-card-hover transition-colors"
				>
					Prev
				</a>
			)}
			{pages.map((page, i) =>
				typeof page === "string" ? (
					<span
						key={`ellipsis-${i}`}
						className="px-2 text-muted"
						aria-hidden="true"
					>
						{page}
					</span>
				) : (
					<a
						key={page}
						href={createPageUrl(page)}
						aria-label={`Go to page ${page}`}
						aria-current={page === currentPage ? "page" : undefined}
						className={`px-4 py-2 rounded-lg transition-colors ${
							page === currentPage
								? "bg-gold text-background"
								: "bg-card border border-border text-foreground hover:bg-card-hover"
						}`}
					>
						{page}
					</a>
				),
			)}
			{currentPage < totalPages && (
				<a
					href={createPageUrl(currentPage + 1)}
					aria-label="Go to next page"
					className="px-4 py-2 bg-card border border-border rounded-lg text-foreground hover:bg-card-hover transition-colors"
				>
					Next
				</a>
			)}
		</nav>
	);
}
