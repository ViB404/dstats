import { CommandUsagePayload } from "./CommandInfo";

export enum EventTypes {
	CommandUse = "command_use",
}

export interface EventPayload {
	id: string;
	event_type: EventTypes;
	payload: CommandUsagePayload;
}
