import { EventDetail } from '../models/event-detail.model';
import { EventType } from '../models/event-type.model';
import { Event } from '../models/event.model';
import { EventTypeBuilder } from './event-type.builder';
import { EventBuilder } from './event.builder';

export class EventDetailBuilder {

	private id: number = 1;
	private event: Event = new EventBuilder().build();
	private eventType: EventType = new EventTypeBuilder().build();
	private startDate: Date = new Date();
	private endDate: Date = new Date();
	private lapDistance: number = 5;
	private distanceUnits: string = 'mi';
	private lapElevation: number = 100;
	private elevationUnits: string = 'ft';

	build(): EventDetail {
		return {
			id: this.id,
			event: this.event,
			eventType: this.eventType,
			startDate: this.startDate,
			endDate: this.endDate,
			lapDistance: this.lapDistance,
			distanceUnits: this.distanceUnits,
			lapElevation: this.lapElevation,
			elevationUnits: this.elevationUnits
		};
	}

}
