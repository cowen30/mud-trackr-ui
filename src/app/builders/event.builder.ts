import { Event } from '../models/event.model';

export class EventBuilder {

	private id: number = 1;
	private name: string = 'Test Event';
	private address: string = '101 Tough Mudder Rd';
	private locality: string = 'Columbus';
	private region: string = 'OH';
	private postalCode: string = '43210';
	private country: string = 'USA';
	private date: Date = new Date();

	build(): Event {
		return {
			id: this.id,
			name: this.name,
			address: this.address,
			locality: this.locality,
			region: this.region,
			postalCode: this.postalCode,
			country: this.country,
			date: this.date
		};
	}

}
