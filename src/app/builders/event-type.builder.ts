import { EventType } from '../models/event-type.model';

export class EventTypeBuilder {

	private id: number = 1;
	private name: string = 'Tough Mudder';
	private shortName: string = 'TM';

	build(): EventType {
		return {
			id: this.id,
			name: this.name,
			shortName: this.shortName
		};
	}

}
