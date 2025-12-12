export function GameCardSkeleton() {
	return (
		<div className="bg-card rounded-lg overflow-hidden animate-pulse border border-border">
			<div className="aspect-video bg-border" />
			<div className="p-4">
				<div className="flex gap-2 mb-2">
					<div className="h-5 w-8 bg-border rounded" />
					<div className="h-5 w-8 bg-border rounded" />
				</div>
				<div className="h-6 bg-border rounded w-3/4 mb-2" />
				<div className="flex gap-3 mt-2">
					<div className="h-4 w-12 bg-border rounded" />
					<div className="h-4 w-10 bg-border rounded" />
				</div>
			</div>
		</div>
	);
}

export function GameGridSkeleton({ count = 8 }: { count?: number }) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
			{Array.from({ length: count }).map((_, i) => (
				<GameCardSkeleton key={i} />
			))}
		</div>
	);
}

export function FiltersSkeleton() {
	return (
		<div className="space-y-4 mb-8 animate-pulse">
			<div className="flex flex-wrap gap-2">
				<div className="h-9 w-28 bg-card border border-border rounded-lg" />
				<div className="h-9 w-24 bg-card border border-border rounded-lg" />
				<div className="h-9 w-28 bg-card border border-border rounded-lg" />
				<div className="h-9 w-24 bg-card border border-border rounded-lg" />
				<div className="h-9 w-32 bg-card border border-border rounded-lg" />
			</div>
			<div className="flex flex-wrap gap-2 items-center">
				<div className="h-4 w-16 bg-border rounded" />
				<div className="h-9 w-36 bg-card border border-border rounded-lg" />
				<div className="h-4 w-2 bg-border rounded" />
				<div className="h-9 w-36 bg-card border border-border rounded-lg" />
			</div>
		</div>
	);
}

export function GameDetailSkeleton() {
	return (
		<div className="animate-pulse">
			<div className="h-6 w-32 bg-card rounded mb-6" />
			<div className="relative rounded-xl overflow-hidden mb-8 border border-border">
				<div className="aspect-video bg-card" />
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
				<div className="lg:col-span-2 space-y-4">
					<div className="h-8 w-24 bg-card rounded" />
					<div className="h-4 bg-card rounded w-full" />
					<div className="h-4 bg-card rounded w-full" />
					<div className="h-4 bg-card rounded w-3/4" />
				</div>
				<div className="space-y-6">
					<div className="bg-card border border-border rounded-lg p-6 h-64" />
					<div className="bg-card border border-border rounded-lg p-6 h-40" />
				</div>
			</div>
		</div>
	);
}
