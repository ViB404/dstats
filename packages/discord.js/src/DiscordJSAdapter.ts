import type { Client } from "discord.js";
import type { Adapter } from "@dstats/sdk";

export class DiscordJSAdapter implements Adapter {
  public constructor(private readonly client: Client) {}

  public onReady(callback: () => void): void {
    this.client.once("clientReady", callback);
  }
}
