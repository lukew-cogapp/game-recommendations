import Image from "next/image";

interface Screenshot {
	id: number;
	image: string;
}

interface ScreenshotGalleryProps {
	screenshots: Screenshot[];
	gameName: string;
}

export function ScreenshotGallery({
	screenshots,
	gameName,
}: ScreenshotGalleryProps) {
	if (screenshots.length === 0) {
		return null;
	}

	return (
		<section className="mb-12">
			<h2 className="text-2xl font-bold text-foreground mb-6">Screenshots</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{screenshots.slice(0, 6).map((screenshot) => (
					<div
						key={screenshot.id}
						className="relative aspect-video rounded-lg overflow-hidden border border-border"
					>
						<Image
							src={screenshot.image}
							alt={`${gameName} screenshot`}
							fill
							sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
							className="object-cover hover:scale-105 transition-transform"
						/>
					</div>
				))}
			</div>
		</section>
	);
}
