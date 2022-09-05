import { Component, OnInit } from '@angular/core';
import { Duration } from 'luxon';
import { Subscription } from 'rxjs';
import { Event as CustomEvent} from 'src/app/models/event.model';
import { EventDetail } from 'src/app/models/event-detail.model';
import { Result } from 'src/app/models/result.model';
import { EventDetailsService } from 'src/app/services/event-details/event-details.service';
import { EventsService } from 'src/app/services/events/events.service';
import { ResultsService } from 'src/app/services/results/results.service';

@Component({
	selector: 'app-results',
	templateUrl: './results.component.html',
	styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {

	events!: CustomEvent[];
	eventDetails!: EventDetail[];
	results!: Result[];

	constructor(
		private eventsService: EventsService,
		private resultsService: ResultsService,
		private eventDetailsService: EventDetailsService
	) { }

	ngOnInit(): void {
		this.getEvents();
	}

	getEvents(): Subscription {
		const eventsSubscription = this.eventsService.getEvents().subscribe((response: CustomEvent[]) => {
			this.events = response;
		});

		setTimeout(() => {
			eventsSubscription.unsubscribe();
		}, 5000);

		return eventsSubscription;
	}

	getEventDetails(eventId: number): Subscription {
		const eventDetailsSubscription = this.eventDetailsService.getEventDetailsByEventId(eventId).subscribe((response: EventDetail[]) => {
			this.eventDetails = response;
		});

		setTimeout(() => {
			eventDetailsSubscription.unsubscribe();
		}, 5000);

		return eventDetailsSubscription;
	}

	getResults(eventDetailId: number) {
		const resultSubscription = this.resultsService.getResults(eventDetailId).subscribe((response: any) => {
			this.results = response.results;
		});

		setTimeout(() => {
			resultSubscription.unsubscribe();
		}, 5000);
	}

	eventSelect(eventTrigger: Event) {
		const selectedEventId: number = parseInt((<HTMLSelectElement> eventTrigger.target).value);
		if (!Number.isNaN(selectedEventId)) {
			this.getEventDetails(selectedEventId);
		}
	}

	eventDetailSelect(eventTrigger: Event) {
		const selectedEventDetailId: number = parseInt((<HTMLSelectElement> eventTrigger.target).value);
		if (!Number.isNaN(selectedEventDetailId)) {
			this.getResults(selectedEventDetailId);
		}
	}

	getDurationString(seconds: number) {
		const duration = Duration.fromMillis(seconds * 1000);
		return duration.toFormat('hh:mm:ss');
	}

}
