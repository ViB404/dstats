import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "cdn.discordapp.com",
			},
			{
				protocol: "https",
				hostname: "api.dicebear.com",
			},
		],
	},
	transpilePackages: [
		"@clerk/nextjs",
		"@tanstack/react-query",
		"@tanstack/react-query-devtools",
		"@vercel/analytics",
		"recharts",
	],
};

export default nextConfig;
