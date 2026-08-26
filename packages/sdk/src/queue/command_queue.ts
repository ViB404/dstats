export class CommandQueue {
	private queue = new Map<string, Map<string, number>>();

	public add(guildId: string, commandName: string): void {
		let commands = this.queue.get(guildId);

		if (!commands) {
			commands = new Map();
			this.queue.set(guildId, commands);
		}

		commands.set(commandName, (commands.get(commandName) ?? 0) + 1);
	}

	public flush(): Map<string, Map<string, number>> {
		const currentQueue = this.queue;
		this.queue = new Map();

		return currentQueue;
	}

	public get size(): number {
		return this.queue.size;
	}
}
