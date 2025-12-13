import {
	FilterSidebarSkeleton,
	FiltersSkeleton,
	GameGridSkeleton,
} from "@/components/Skeleton";

export default function Loading() {
	return (
		<div>
			{/* Header */}
			<div className="mb-6">
				<div className="h-10 w-64 bg-card rounded mb-2 animate-pulse" />
				<div className="h-5 w-80 bg-card rounded animate-pulse" />
			</div>

			{/* Sidebar + Main content */}
			<div className="flex flex-col lg:flex-row gap-8">
				{/* Sidebar - Desktop only */}
				<div className="hidden lg:block w-56 flex-shrink-0">
					<FilterSidebarSkeleton />
				</div>

				{/* Main content */}
				<div className="flex-1 min-w-0">
					{/* Search heading - Desktop only */}
					<div className="hidden lg:block h-4 w-14 bg-border rounded mb-3 animate-pulse" />
					{/* Search bar skeleton */}
					<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6 animate-pulse">
						<div className="h-10 sm:max-w-xl flex-1 bg-card border border-border rounded-lg" />
						<div className="h-10 w-full sm:w-36 bg-card border border-border rounded-lg" />
					</div>

					{/* Mobile/Tablet filters */}
					<div className="lg:hidden">
						<FiltersSkeleton />
					</div>

					{/* Sort + results count skeleton */}
					<div className="flex items-center gap-4 mb-4 animate-pulse">
						<div className="flex items-center gap-2">
							<div className="h-4 w-14 bg-border rounded" />
							<div className="h-10 w-36 bg-card border border-border rounded-lg" />
						</div>
						<div className="h-4 w-32 bg-border rounded" />
					</div>

					<GameGridSkeleton count={8} />
				</div>
			</div>
		</div>
	);
}
