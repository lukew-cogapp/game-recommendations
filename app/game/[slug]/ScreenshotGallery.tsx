"use client";

import Image from "next/image";
import { useState } from "react";
import { Modal } from "@/components/ui";

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
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

	if (screenshots.length === 0) {
		return null;
	}

	const displayedScreenshots = screenshots.slice(0, 6);
	const selectedScreenshot =
		selectedIndex !== null ? displayedScreenshots[selectedIndex] : null;

	const handlePrevious = () => {
		if (selectedIndex !== null && selectedIndex > 0) {
			setSelectedIndex(selectedIndex - 1);
		}
	};

	const handleNext = () => {
		if (
			selectedIndex !== null &&
			selectedIndex < displayedScreenshots.length - 1
		) {
			setSelectedIndex(selectedIndex + 1);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "ArrowLeft") {
			handlePrevious();
		} else if (e.key === "ArrowRight") {
			handleNext();
		}
	};

	return (
		<section>
			<h2 className="text-xl font-bold text-foreground mb-4">Screenshots</h2>
			<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
				{displayedScreenshots.map((screenshot, index) => (
					<button
						key={screenshot.id}
						type="button"
						onClick={() => setSelectedIndex(index)}
						className="relative aspect-video rounded-lg overflow-hidden border border-border focus:outline-none focus:ring-2 focus:ring-gold"
					>
						<Image
							src={screenshot.image}
							alt={`${gameName} screenshot ${index + 1}`}
							fill
							sizes="(max-width: 640px) 50vw, 33vw"
							className="object-cover hover:scale-105 transition-transform"
						/>
					</button>
				))}
			</div>

			<Modal
				isOpen={selectedIndex !== null}
				onClose={() => setSelectedIndex(null)}
				label={`${gameName} screenshot ${selectedIndex !== null ? selectedIndex + 1 : ""}`}
			>
				{selectedScreenshot && (
					// biome-ignore lint/a11y/noStaticElementInteractions: keyboard navigation for screenshots
					<div onKeyDown={handleKeyDown}>
						<div className="relative aspect-video rounded-lg overflow-hidden">
							<Image
								src={selectedScreenshot.image}
								alt={`${gameName} screenshot ${selectedIndex !== null ? selectedIndex + 1 : ""}`}
								fill
								sizes="100vw"
								className="object-contain"
								priority
							/>
						</div>

						{displayedScreenshots.length > 1 && (
							<div className="flex items-center justify-center gap-4 mt-4">
								<button
									type="button"
									onClick={handlePrevious}
									disabled={selectedIndex === 0}
									className="p-2 text-foreground/80 hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
									aria-label="Previous screenshot"
								>
									<svg
										className="w-8 h-8"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M15 19l-7-7 7-7"
										/>
									</svg>
								</button>

								<span className="text-foreground/60 text-sm">
									{selectedIndex !== null ? selectedIndex + 1 : 0} /{" "}
									{displayedScreenshots.length}
								</span>

								<button
									type="button"
									onClick={handleNext}
									disabled={selectedIndex === displayedScreenshots.length - 1}
									className="p-2 text-foreground/80 hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
									aria-label="Next screenshot"
								>
									<svg
										className="w-8 h-8"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 5l7 7-7 7"
										/>
									</svg>
								</button>
							</div>
						)}
					</div>
				)}
			</Modal>
		</section>
	);
}
