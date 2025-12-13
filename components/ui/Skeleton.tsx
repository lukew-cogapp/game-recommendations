interface SkeletonProps {
	className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
	return (
		<div
			className={`bg-border animate-pulse rounded ${className}`}
			aria-hidden="true"
		/>
	);
}

export function GameCardSkeleton() {
	return (
		<div className="bg-card rounded-lg overflow-hidden border border-border">
			<Skeleton className="aspect-video rounded-none" />
			<div className="p-4 space-y-3">
				<Skeleton className="h-5 w-3/4" />
				<div className="flex gap-2">
					<Skeleton className="h-4 w-16" />
					<Skeleton className="h-4 w-12" />
				</div>
				<div className="flex gap-1">
					<Skeleton className="h-5 w-5 rounded" />
					<Skeleton className="h-5 w-5 rounded" />
					<Skeleton className="h-5 w-5 rounded" />
				</div>
			</div>
		</div>
	);
}

export function GameCardSkeletonGrid({ count = 8 }: { count?: number }) {
	return (
		<output
			className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6"
			aria-label="Loading games"
		>
			{[...Array(count)].map((_, i) => (
				<GameCardSkeleton key={i} />
			))}
		</output>
	);
}

export function ScreenshotSkeleton() {
	return (
		<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
			{[...Array(6)].map((_, i) => (
				<Skeleton key={i} className="aspect-video rounded-lg" />
			))}
		</div>
	);
}

export function SeriesCardSkeleton() {
	return (
		<div className="flex-shrink-0 w-48 bg-card rounded-lg overflow-hidden border border-border">
			<Skeleton className="aspect-video rounded-none" />
			<div className="p-3 space-y-2">
				<Skeleton className="h-4 w-3/4" />
				<Skeleton className="h-3 w-1/2" />
			</div>
		</div>
	);
}

export function SeriesSkeletonRow({ count = 4 }: { count?: number }) {
	return (
		<output
			className="flex gap-4 overflow-x-auto pb-2"
			aria-label="Loading series"
		>
			{[...Array(count)].map((_, i) => (
				<SeriesCardSkeleton key={i} />
			))}
		</output>
	);
}
