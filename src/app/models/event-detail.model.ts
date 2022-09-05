import { EventType } from "./event-type.model";
import { Event } from "./event.model";

export interface EventDetail {
	id: number,
	event: Event,
	eventType: EventType,
	startDate: Date,
	endDate: Date,
	lapDistance: number,
	distanceUnits: string,
	lapElevation: number,
	elevationUnits: string
}
