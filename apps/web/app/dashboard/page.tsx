"use client";

import { Key, Loader2 } from "lucide-react";
import Navbar from "../components/layout/navbar";
import Footer from "../components/layout/footer";
import { motion, Variants } from "framer-motion";
import { useDashboardData } from "@/hooks/use_dashboard_data";
import ApiKeyModal from "../components/dashboard/api_key_modal";
import { Button } from "@base-ui/react";
import StatsCards from "../components/dashboard/stats_cards";
import BotSummaryCard from "../components/dashboard/bot_summary_card";
import GuildGrid from "../components/dashboard/guild_grid";

const containerVariants: Variants = {
	hidden: { opacity: 0 },
	show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

export default function DashboardPage() {
	const {
		isMounted,
		isModalOpen,
		setIsModalOpen,
		inputKey,
		setInputKey,
		isSavingKey,
		handleSaveKey,

		botData,
		stats,
		guilds,

		isLoading,
		isFetchingMore,
		hasMore,
		loadMore,
	} = useDashboardData();

	if (!isMounted) return null;

	return (
		<div className="bg-neutral-950 min-h-screen flex flex-col font-sans">
			<Navbar />

			<ApiKeyModal
				open={isModalOpen}
				onOpenChangeAction={setIsModalOpen}
				inputKey={inputKey}
				onInputKeyChangeAction={setInputKey}
				onSaveAction={handleSaveKey}
				isSaving={isSavingKey}
			/>

			<main className="grow w-full max-w-7xl mx-auto px-4 md:px-12 pt-32 pb-12">
				{isLoading && guilds.length === 0 ? (
					<div className="w-full h-[60vh] flex flex-col items-center justify-center text-neutral-500 gap-4">
						<Loader2 className="w-10 h-10 animate-spin text-[#7F7EFF]" />
						<p className="font-mono text-sm tracking-widest uppercase">Fetching Analytics...</p>
					</div>
				) : (
					<motion.div
						variants={containerVariants}
						initial="hidden"
						animate="show"
						className="space-y-10 w-full"
					>
						<header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
							<div className="space-y-2">
								<span className="text-xs font-semibold text-[#7F7EFF] tracking-widest uppercase">
									System Analytics
								</span>
								<h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
									Dashboard Overview
								</h1>
							</div>
							<Button
								onClick={() => setIsModalOpen(true)}
								className="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl px-4 py-6 flex items-center gap-2 transition-all active:scale-95"
							>
								<Key className="w-4 h-4 text-[#7F7EFF]" />
								Update API Key
							</Button>
						</header>

						<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
							<StatsCards stats={stats} />
							<BotSummaryCard botData={botData} />
						</div>

						<hr className="border-white/5" />

						<GuildGrid
							guilds={guilds}
							hasMore={hasMore}
							isFetchingMore={isFetchingMore}
							onLoadMoreAction={loadMore}
						/>
					</motion.div>
				)}
			</main>
			<Footer />
		</div>
	);
}
