import { FiltersSkeleton, GameGridSkeleton } from "@/components/Skeleton";

export default function Loading() {
	return (
		<div>
			<div className="mb-8">
				<div className="h-10 w-64 bg-card rounded mb-2 animate-pulse" />
				<div className="h-5 w-80 bg-card rounded animate-pulse" />
			</div>
			<FiltersSkeleton />
			<GameGridSkeleton count={8} />
		</div>
	);
}
