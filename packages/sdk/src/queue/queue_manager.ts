import { CommandQueue } from "./command_queue";

export class QueueManager {
	public readonly commands: CommandQueue;

	public constructor() {
		this.commands = new CommandQueue();
	}

	public flush(): void {
		this.commands.flush();
	}
}
