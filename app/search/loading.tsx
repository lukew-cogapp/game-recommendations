import { GameGridSkeleton } from "@/components/Skeleton";

export default function Loading() {
	return (
		<div>
			<div className="mb-8">
				<div className="h-6 w-32 bg-card rounded mb-4 animate-pulse" />
				<div className="h-9 w-72 bg-card rounded mb-2 animate-pulse" />
				<div className="h-5 w-40 bg-card rounded animate-pulse" />
			</div>
			<GameGridSkeleton count={8} />
		</div>
	);
}
