import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "media.rawg.io",
				pathname: "/media/**",
			},
		],
		// Enable modern formats for better compression (AVIF first, then WebP fallback)
		formats: ["image/avif", "image/webp"],
		// Device breakpoints for responsive images
		deviceSizes: [640, 750, 828, 1080, 1200, 1920],
		// Smaller sizes for thumbnail images
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
		// Allow quality 70 for better compression
		qualities: [70, 75],
	},
};

export default nextConfig;
