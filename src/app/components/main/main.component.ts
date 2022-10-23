import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map, Observable, startWith, Subscription } from 'rxjs';

import { NgxSpinnerService } from 'ngx-spinner';

import { DurationHelper } from 'src/app/helpers/duration.helper';
import { EventDetail } from 'src/app/models/event-detail.model';
import { Event as CustomEvent } from 'src/app/models/event.model';
import { ResultResponse } from 'src/app/models/result-response';
import { Result } from 'src/app/models/result.model';
import { EventDetailsService } from 'src/app/services/event-details/event-details.service';
import { EventsService } from 'src/app/services/events/events.service';
import { ResultsService } from 'src/app/services/results/results.service';
import { ResultDetailsComponent } from './results/result-details/result-details.component';
import { StatsComponent } from './stats/stats.component';

const FILTER_PAG_REGEX = /\D/g;

@Component({
	selector: 'app-main',
	templateUrl: './main.component.html',
	styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

	@ViewChild('statsComponent') private statsComponent!: StatsComponent;

	activeTab: number = 1;

	events!: CustomEvent[];
	eventDetails!: EventDetail[];

	selectedEventDetailId!: number;

	results!: Result[];
	results$!: Observable<Result[]>;
	filter = new FormControl('', { nonNullable: true });

	constructor(
		public durationHelper: DurationHelper,
		private eventsService: EventsService,
		private resultsService: ResultsService,
		private eventDetailsService: EventDetailsService,
		private modalService: NgbModal,
		private spinner: NgxSpinnerService
	) { }

	ngOnInit(): void {
		this.getEvents();
	}

	page = 1;
	totalResults = 0;

	selectPage(page: string) {
		this.page = parseInt(page, 10) || 1;
	}

	formatInput(input: HTMLInputElement) {
		input.value = input.value.replace(FILTER_PAG_REGEX, '');
	}

	openModal(result: Result) {
		const modalRef = this.modalService.open(ResultDetailsComponent, { size: 'lg' });
		modalRef.componentInstance.result = result;
	}

	displayStats() {
		this.statsComponent.displayCharts();
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
		const spinnerName = this.totalResults == 0 ? 'fullSpinner' : 'innerSpinner';
		this.spinner.show(spinnerName);
		const resultSubscription = this.resultsService.getResults(eventDetailId, this.page).subscribe((response: ResultResponse) => {
			this.results = response.results;
			this.totalResults = response.metadata.total;
			this.results$ = this.filter.valueChanges.pipe(
				startWith(''),
				map(text => this.search(text))
			);
			this.spinner.hide(spinnerName);
			if (this.activeTab === 3) {
				this.displayStats();
			}
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
			this.selectedEventDetailId = selectedEventDetailId;
			this.getResults(selectedEventDetailId);
		}
	}

	search(text: string): Result[] {
		if (this.results == undefined) {
			return [];
		}

		return this.results.filter(result => {
			const term = text.toLowerCase();
			return result.participant.person.name.toLowerCase().includes(term)
				|| result.participant.bibNumber.includes(term);
		});
	}

}
