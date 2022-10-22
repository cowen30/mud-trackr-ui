import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Duration } from 'luxon';
import { map, Observable, startWith, Subscription } from 'rxjs';
import { DurationHelper } from 'src/app/helpers/duration.helper';
import { NgxSpinnerService } from "ngx-spinner";

import { EventDetail } from 'src/app/models/event-detail.model';
import { Event as CustomEvent } from 'src/app/models/event.model';
import { ResultResponse } from 'src/app/models/result-response';
import { ResultStats } from 'src/app/models/result-stats.model';
import { Result } from 'src/app/models/result.model';
import { EventDetailsService } from 'src/app/services/event-details/event-details.service';
import { EventsService } from 'src/app/services/events/events.service';
import { ResultsService } from 'src/app/services/results/results.service';
import { ResultDetailsComponent } from './results/result-details/result-details.component';

const DEFAULT_GENDER_LABELS: string[] = [
	'Male',
	'Female',
	'Other'
]

const DEFAULT_GENDER_COLORS: string[] = [
	'rgb(54, 162, 235)',
	'rgb(255, 99, 132)',
	'rgb(255, 205, 86)'
];

const FILTER_PAG_REGEX = /\D/g;

@Component({
	selector: 'app-main',
	templateUrl: './main.component.html',
	styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

	@ViewChild('genderDistributionChart') private genderDistributionChartRef!: ElementRef;
	genderDistributionChart!: Chart;

	@ViewChild('ageGroupDistributionChart') private ageGroupDistributionChartRef!: ElementRef;
	ageGroupDistributionChart!: Chart;

	activeTab: number = 1;

	events!: CustomEvent[];
	eventDetails!: EventDetail[];

	selectedEventDetailId!: number;

	results!: Result[];
	results$!: Observable<Result[]>;
	filter = new FormControl('', { nonNullable: true });

	genderDistributionLabels: string[] = [];
	genderDistributionData: number[] = [];
	genderDistributionBackgroundColors: string[] = [];

	ageGroupDistributionLabels: string[] = [];
	ageGroupDistributionDataMale: number[] = [];
	ageGroupDistributionDataFemale: number[] = [];

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
		this.generateGenderDistributionChart();
		this.generateAgeGroupDistributionChart();
	}

	generateGenderDistributionChart(): void {
		if (this.genderDistributionData.length > 0) {
			this.genderDistributionChart = new Chart(this.genderDistributionChartRef.nativeElement, {
				type: 'pie',
				data: {
					labels: this.genderDistributionLabels,
					datasets: [{
						label: 'Gender Distribution',
						data: this.genderDistributionData,
						backgroundColor: this.genderDistributionBackgroundColors,
						hoverBackgroundColor: this.genderDistributionBackgroundColors,
						hoverBorderColor: this.genderDistributionBackgroundColors,
						hoverOffset: 4
					}]
				},
				plugins: [
					ChartDataLabels
				],
				options: {
					responsive: true,
					plugins: {
						title: {
							display: true,
							text: 'Gender Distribution'
						},
						legend: {
							display: true,
							position: 'top',
						},
						tooltip: {
							enabled: false
						},
						datalabels: {
							formatter: (value, ctx) => {
								let sum = 0;
								let dataArray = ctx.dataset.data;
								dataArray.map(data => {
									if (!isNaN(Number(data))) {
										sum += Number(data);
									}
								});
								let percentage = (value * 100 / sum).toFixed(0) + "%";
								return percentage;
							},
							color: '#FFFFFF',
							font: {
								size: 24
							}
						}
					}
				}
			});
		}
	}

	generateAgeGroupDistributionChart(): void {
		if (this.ageGroupDistributionLabels.length > 0) {
			this.ageGroupDistributionChart = new Chart(this.ageGroupDistributionChartRef.nativeElement, {
				type: 'bar',
				data: {
					labels: this.ageGroupDistributionLabels,
					datasets: [
						{
							label: 'Male',
							data: this.ageGroupDistributionDataMale,
							backgroundColor: this.genderDistributionBackgroundColors[0],
							hoverBackgroundColor: this.genderDistributionBackgroundColors[0],
							hoverBorderColor: this.genderDistributionBackgroundColors[0],
						},
						{
							label: 'Female',
							data: this.ageGroupDistributionDataFemale,
							backgroundColor: this.genderDistributionBackgroundColors[1],
							hoverBackgroundColor: this.genderDistributionBackgroundColors[1],
							hoverBorderColor: this.genderDistributionBackgroundColors[1],
						}
					]
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					plugins: {
						title: {
							display: true,
							text: 'Age Group Distribution'
						},
						tooltip: {
							callbacks: {
								label: (c) => {
									const value = Number(c.raw);
									const positiveOnly = value < 0 ? -value : value;
									let retStr = '';
									if (c.datasetIndex === 0) {
										retStr += `Male: ${positiveOnly.toString()}`;
									} else {
										retStr += `Female: ${positiveOnly.toString()}`;
									}
									return retStr;
								}
							}
						}
					},
					indexAxis: 'y',
					scales: {
						x: {
							beginAtZero: true,
							stacked: false,
							ticks: {
								stepSize: 5,
								callback: (v) => {
									return v < 0 ? -v : v;
								}
							}
						},
						y: {
							stacked: true
						}
					}
				}
			});
		}
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
		});

		setTimeout(() => {
			resultSubscription.unsubscribe();
		}, 5000);
	}

	getStats(eventDetailId: number) {
		const statsSubscription = this.resultsService.getStats(eventDetailId).subscribe((response: ResultStats) => {
			this.genderDistributionLabels = DEFAULT_GENDER_LABELS.filter((_, index) => {
				return Object.values(response.gender)[index] > 0
			});
			this.genderDistributionData = Object.values(response.gender).filter(gender => {
				return gender > 0;
			});
			this.genderDistributionBackgroundColors = DEFAULT_GENDER_COLORS.filter((_, index) => {
				return Object.values(response.gender)[index] > 0
			});
			response.ageGroup.map(ageGroup => {
				const ageRange = ageGroup.name.slice(1);
				if (!this.ageGroupDistributionLabels.includes(ageRange)) {
					this.ageGroupDistributionLabels.push(ageRange);
					this.ageGroupDistributionDataFemale.push(0);
					this.ageGroupDistributionDataMale.push(0);
				}
			});
			this.ageGroupDistributionLabels.sort();
			response.ageGroup.map(ageGroup => {
				const ageRange = ageGroup.name.slice(1);
				const genderInitial = ageGroup.name.charAt(0);
				if (genderInitial === 'M') {
					this.ageGroupDistributionDataMale[this.ageGroupDistributionLabels.indexOf(ageRange)] = -ageGroup.count;
				}
				if (genderInitial === 'F') {
					this.ageGroupDistributionDataFemale[this.ageGroupDistributionLabels.indexOf(ageRange)] = ageGroup.count;
				}
			});

			if (this.activeTab === 3) {
				this.displayStats();
			}
		});

		setTimeout(() => {
			statsSubscription.unsubscribe();
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
			this.getStats(selectedEventDetailId);
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
