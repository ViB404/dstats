import { GuildJoinPayload, GuildLeavePayload } from "../types";

export class ApiClient {
  constructor(
    private readonly baseUrl: string,
    private readonly apiKey: string,
  ) {}

  private async request(path: string, body: unknown): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method: "POST",
        headers: {
          "X-API-Key": `${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        // console.warn(`[DStats] ${response.status}`, await response.text());
      }
    } catch (error) {
      // console.warn("[DStats] Failed to send analytics", error);
    }
  }

  public guildJoin(body: GuildJoinPayload) {
    return this.request("/v1/guild/join", body);
  }

  public guildLeave(body: GuildLeavePayload) {
    return this.request("/v1/guild/leave", body);
  }
}
