"use client";

import { Card } from "@/components/ui/card";
import { Terminal, Activity, SlashSquare } from "lucide-react";
import { motion, Variants } from "framer-motion";

export interface CommandStatItem {
	command: string;
	uses: number;
}

export interface CommandUsageData {
	total_uses?: number;
	total_commands?: number;
	last_activity?: string | null;
	commands?: CommandStatItem[];
}

const itemVariants: Variants = {
	hidden: { opacity: 0, scale: 0.95, y: 15 },
	show: {
		opacity: 1,
		scale: 1,
		y: 0,
		transition: {
			type: "spring",
			stiffness: 300,
			damping: 24,
		},
	},
};

type CommandUsageCardProps = {
	data?: CommandUsageData;
};

export default function CommandUsageCard({ data }: CommandUsageCardProps) {
	const commands = data?.commands ?? [];
	const hasCommands = commands.length > 0;

	const totalUses = data?.total_uses ?? commands.reduce((acc, curr) => acc + curr.uses, 0);

	const totalCommands = data?.total_commands ?? commands.length;

	const maxUses = hasCommands ? Math.max(...commands.map(command => command.uses)) : 1;

	return (
		<motion.div variants={itemVariants} className="w-full lg:col-span-8">
			<Card className="p-6 bg-[#7F7EFF]/5 border-[#7F7EFF]/20 rounded-2xl h-full flex flex-col justify-between relative overflow-hidden">
				<div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
					<Terminal className="w-28 h-28 text-[#7F7EFF]" />
				</div>

				<div className="relative z-10 flex flex-col gap-6">
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
						<div className="flex items-center gap-3">
							<div className="p-2.5 rounded-xl bg-[#7F7EFF]/10 border border-[#7F7EFF]/30 text-[#7F7EFF]">
								<Terminal className="w-5 h-5" />
							</div>

							<div>
								<h3 className="text-lg font-bold text-white flex items-center gap-2">Command Usage</h3>

								<p className="text-xs text-neutral-400">
									{totalCommands > 0
										? `${totalCommands} tracked commands`
										: "Tracking active commands"}
								</p>
							</div>
						</div>

						<span className="self-start sm:self-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#7F7EFF]/10 text-[#7F7EFF] border border-[#7F7EFF]/20">
							<SlashSquare className="w-3 h-3" />
							{totalUses.toLocaleString()} total uses
						</span>
					</div>

					{!hasCommands ? (
						<div className="py-12 px-4 rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center justify-center text-center">
							<Activity className="w-8 h-8 text-neutral-500 mb-2 animate-pulse" />

							<p className="text-sm font-medium text-neutral-300">No command usage yet</p>

							<span className="text-xs text-neutral-500 mt-1">
								Execute a slash command to start logging
							</span>
						</div>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							{commands.map((item, index) => {
								const percentage = Math.round((item.uses / maxUses) * 100);

								return (
									<div
										key={item.command}
										className="group relative p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 transition-all overflow-hidden"
									>
										<div
											className="absolute left-0 top-0 bottom-0 bg-[#7F7EFF]/10 transition-all duration-500 group-hover:bg-[#7F7EFF]/15"
											style={{
												width: `${percentage}%`,
											}}
										/>

										<div className="relative z-10 flex items-center justify-between gap-2">
											<div className="flex items-center gap-2 font-mono text-sm">
												<span className="text-neutral-500 text-xs w-4">{index + 1}.</span>

												<span className="text-neutral-200 font-semibold group-hover:text-white">
													{item.command}
												</span>
											</div>

											<div className="flex items-center gap-1 text-xs font-mono font-medium text-neutral-300">
												{item.uses.toLocaleString()}
											</div>
										</div>
									</div>
								);
							})}
						</div>
					)}
				</div>

				<div className="mt-6 pt-4 border-t border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 relative z-10 text-xs text-neutral-500">
					<div className="flex items-center gap-1">
						<span>Last Updated:</span>

						<span className="text-neutral-300 font-medium">
							{data?.last_activity ? new Date(data.last_activity).toLocaleString() : "Never"}
						</span>
					</div>
				</div>
			</Card>
		</motion.div>
	);
}
