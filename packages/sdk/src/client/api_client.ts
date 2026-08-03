import { GuildJoinPayload, GuildLeavePayload } from "../types";
import { logger } from "../utils/logger";

export class ApiClient {
	constructor(
		private readonly baseUrl: string,
		private readonly apiKey: string
	) {}

	private async request(path: string, body: unknown): Promise<void> {
		try {
			logger.log(`POST ${path}`, body);

			const response = await fetch(`${this.baseUrl}${path}`, {
				method: "POST",
				headers: {
					"X-API-Key": this.apiKey,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body),
				signal: AbortSignal.timeout(15_000),
			});

			if (!response.ok) {
				logger.warn(`Request failed (${response.status})`, await response.text());
				return;
			}

			logger.log(`Request successful (${response.status})`);
		} catch (error) {
			logger.error("Failed to send analytics:", error);
		}
	}

	public guildJoin(body: GuildJoinPayload) {
		return this.request("/v1/guild/join", body);
	}

	public guildLeave(body: GuildLeavePayload) {
		return this.request("/v1/guild/leave", body);
	}
}
