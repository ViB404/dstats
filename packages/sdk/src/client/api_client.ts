import { GuildJoinPayload, GuildLeavePayload } from "../types";
import { EventPayload } from "../types/Event";
import { logger } from "../utils/logger";

export class ApiClient {
	constructor(
		private readonly baseUrl: string,
		private readonly apiKey: string
	) {}

	private async request(path: string, body: unknown): Promise<void> {
		try {
			logger.log(`[API] POST ${this.baseUrl}${path}`);
			logger.log("[API] Request body:", body);

			const response = await fetch(`${this.baseUrl}${path}`, {
				method: "POST",
				headers: {
					"X-API-Key": this.apiKey,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body),
				signal: AbortSignal.timeout(15_000),
			});

			const responseBody = await response.text();

			if (!response.ok) {
				logger.warn(`[API] Request failed: ${response.status} ${response.statusText}`);
				logger.warn("[API] Response:", responseBody);
				return;
			}

			logger.log(`[API] Request successful: ${response.status} ${response.statusText}`);

			if (responseBody) {
				logger.log("[API] Response:", responseBody);
			}
		} catch (error) {
			logger.error(`[API] Failed to send request to ${path}`, error);
		}
	}

	public guildJoin(body: GuildJoinPayload) {
		logger.log("[API] Sending guild join event:", body);

		return this.request("/v1/guild/join", body);
	}

	public guildLeave(body: GuildLeavePayload) {
		logger.log("[API] Sending guild leave event:", body);

		return this.request("/v1/guild/leave", body);
	}

	public events(body: EventPayload[]) {
		logger.log("[API] Sending analytics events");
		logger.log("[API] Event count:", body.length);

		for (const event of body) {
			logger.log("[API] Event ID:", event.id);
			logger.log("[API] Event type:", event.event_type);
			logger.log("[API] Event payload:", event.payload);
		}

		return this.request("/v1/event", body);
	}
}
