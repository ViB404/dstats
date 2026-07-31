"use client";

import { motion, Variants } from "framer-motion";
import { Inbox, Loader2 } from "lucide-react";
import { GuildInfo } from "@/types/api";
import GuildCard from "./guild_card";
import { Button } from "@base-ui/react";

const containerVariants: Variants = {
	hidden: { opacity: 0 },
	show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

type GuildGridProps = {
	guilds: GuildInfo[];
	hasMore: boolean;
	isFetchingMore: boolean;
	onLoadMoreAction: () => void;
};

export default function GuildGrid({ guilds, hasMore, isFetchingMore, onLoadMoreAction }: GuildGridProps) {
	return (
		<div>
			<div className="mb-6 flex justify-between items-end">
				<div>
					<h2 className="text-2xl font-bold text-white">Recent Guild Activity</h2>
				</div>
			</div>

			{guilds.length === 0 ? (
				<div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-[#121212]/60 px-8 py-16 text-center">
					<div className="mb-5 rounded-2xl border border-white/5 bg-white/5 p-4">
						<Inbox className="h-10 w-10 text-neutral-500" />
					</div>

					<h3 className="text-lg font-semibold text-white">No guild activity yet</h3>

					<p className="mt-2 max-w-sm text-sm leading-6 text-neutral-400">
						This bot hasn't joined or left any servers yet. Guild activity will appear here once events
						start being tracked.
					</p>
				</div>
			) : (
				<motion.div
					variants={containerVariants}
					initial="hidden"
					animate="show"
					className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
				>
					{guilds.map(guild => (
						<GuildCard key={guild.discord_guild_id} guild={guild} />
					))}
				</motion.div>
			)}

			{hasMore && guilds.length > 0 && (
				<div className="mt-10 flex justify-center">
					<Button
						onClick={onLoadMoreAction}
						disabled={isFetchingMore}
						className="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl px-8 py-6 flex items-center gap-3 transition-all"
					>
						{isFetchingMore ? (
							<>
								<Loader2 className="w-5 h-5 animate-spin" /> Fetching...
							</>
						) : (
							"Load More Guilds"
						)}
					</Button>
				</div>
			)}
		</div>
	);
}
