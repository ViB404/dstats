import type { Adapter } from "./adapters/Adapter";
import { ApiClient } from "./client/api_client";
import { QueueManager } from "./queue/queue_manager";
import { EventPayload, EventTypes, GuildJoinPayload, GuildLeavePayload } from "./types/index";
import { logger } from "./utils/logger";

export interface StatsOptions {
	apiKey: string;
	adapter: Adapter;
	baseUrl?: string;
	debug?: boolean;
}

export class Stats {
	private readonly apiClient: ApiClient;
	private readonly queueManager: QueueManager;
	private readonly flushTimer: ReturnType<typeof setInterval>;
	private static readonly FLUSH_TIME = 5 * 60 * 1000;

	public constructor(private readonly options: StatsOptions) {
		logger.setDebug(options.debug ?? false);

		this.apiClient = new ApiClient(options.baseUrl ?? "https://api.havochz.xyz", options.apiKey);

		this.queueManager = new QueueManager();

		this.registerEvents();
		this.flushTimer = this.startQueueFlush();
	}

	private registerEvents(): void {
		this.options.adapter.onReady(() => {
			// TODO
		});

		this.options.adapter.onGuildJoin(guildInfo => {
			const payload: GuildJoinPayload = {
				discord_guild_id: guildInfo.discord_guild_id,
				name: guildInfo.name,
				icon: guildInfo.icon,
				member_count: guildInfo.member_count,
			};

			this.apiClient.guildJoin(payload).catch(e => {
				logger.error(e);
			});
		});

		this.options.adapter.onGuildLeave(guildLeft => {
			const payload: GuildLeavePayload = {
				guild_id: guildLeft.guild_id,
			};

			this.apiClient.guildLeave(payload).catch(e => {
				logger.error(e);
			});
		});

		this.options.adapter.onCommandUse(commandUse => {
			logger.log("[DStats] Command received:", commandUse);

			this.queueManager.commands.add(commandUse.guild_id, commandUse.command_name);
		});
	}

	private startQueueFlush(): ReturnType<typeof setInterval> {
		return setInterval(() => {
			this.flushQueues().catch(e => {
				logger.error("[DStats] Failed to flush queues:", e);
			});
		}, Stats.FLUSH_TIME);
	}

	private async flushQueues(): Promise<void> {
		const commands = this.queueManager.commands.flush();

		if (commands.size === 0) {
			return;
		}

		const events: EventPayload[] = [];

		for (const [guildId, guildCommands] of commands) {
			events.push({
				id: crypto.randomUUID(),
				event_type: EventTypes.CommandUse,
				payload: {
					guild_id: guildId,
					commands: Object.fromEntries(guildCommands),
				},
			});
		}

		logger.log("[DStats] Flushing events:", events);

		await this.apiClient.events(events);
	}

	public destroy(): void {
		clearInterval(this.flushTimer);
	}
}
