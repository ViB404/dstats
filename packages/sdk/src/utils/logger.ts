export class Logger {
	private enabled = false;

	public setDebug(enabled: boolean) {
		this.enabled = enabled;
	}

	public log(...args: unknown[]) {
		if (this.enabled) {
			console.log("[DStats]", ...args);
		}
	}

	public warn(...args: unknown[]) {
		if (this.enabled) {
			console.warn("[DStats]", ...args);
		}
	}

	public error(...args: unknown[]) {
		if (this.enabled) {
			console.error("[DStats]", ...args);
		}
	}
}

export const logger = new Logger();
