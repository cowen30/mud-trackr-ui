import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, debounceTime, Observable, Subject, Subscription, switchMap, tap, timeout } from 'rxjs';

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

interface State {
	page: number;
	pageSize: number;
	searchTerm: string;
	eventDetailId: number;
}

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

	private _loading$ = new BehaviorSubject<boolean>(true);
	private _search$ = new Subject<void>();
	private _results$ = new BehaviorSubject<Result[]>([]);
	private _total$ = new BehaviorSubject<number>(0);

	private _state: State = {
		page: 1,
		pageSize: 4,
		searchTerm: '',
		eventDetailId: 0
	};

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

	get results$() {
		return this._results$.asObservable();
	}

	get total$() {
		return this._total$.asObservable();
	}

	get loading$() {
		return this._loading$.asObservable();
	}

	get page() {
		return this._state.page;
	}

	get pageSize() {
		return this._state.pageSize;
	}

	get searchTerm() {
		return this._state.searchTerm;
	}

	get eventDetailId() {
		return this._state.eventDetailId;
	}

	set page(page: number) {
		this._set({ page });
	}

	set pageSize(pageSize: number) {
		this._set({ pageSize });
	}

	set searchTerm(searchTerm: string) {
		this._set({ searchTerm });
	}

	private _set(patch: Partial<State>) {
		Object.assign(this._state, patch);
		this._search$.next();
	}

	selectPage(page: string) {
		this.page = parseInt(page, 10) || 1;
	}

	formatInput(input: HTMLInputElement) {
		input.value = input.value.replace(FILTER_PAG_REGEX, '');
	}

	openModal(result: Result) {
		const modalRef = this.modalService.open(ResultDetailsComponent, { size: 'lg' });
		modalRef.componentInstance.result = result;
		modalRef.shown.subscribe(() => {
			modalRef.componentInstance.resultDetailModalShown = true;
		});
	}

	displayStats() {
		this.statsComponent.displayCharts();
	}

	getEvents(): void {
		this.eventsService.getEvents()
			.pipe(timeout({ first: 5000 }))
			.subscribe((response: CustomEvent[]) => {
				this.events = response;
			});
	}

	getEventDetails(eventId: number): void {
		this.eventDetailsService.getEventDetailsByEventId(eventId)
			.pipe(timeout({ first: 5000 }))
			.subscribe((response: EventDetail[]) => {
				this.eventDetails = response;
			});
	}

	getResults() {
		const spinnerName = 'fullSpinner';
		this.spinner.show(spinnerName);

		this._search$
			.pipe(
				tap(() => this._loading$.next(true)),
				debounceTime(200),
				switchMap(() => this._search()),
				tap(() => this._loading$.next(false)),
			)
			.subscribe((response: ResultResponse) => {
				this._results$.next(response.results);
				this._total$.next(response.metadata.total);

				this.spinner.hide(spinnerName);
				if (this.activeTab === 3) {
					this.displayStats();
				}
			});

		this._search$.next();
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
			this._state.eventDetailId = selectedEventDetailId;
			this.getResults();
		}
	}

	private _search(): Observable<ResultResponse> {
		const { page, searchTerm, eventDetailId } = this._state;

		return this.resultsService.searchResults(eventDetailId, searchTerm.toLowerCase(), page);
	}

}
