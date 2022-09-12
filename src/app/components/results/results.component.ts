import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Duration } from 'luxon';
import { map, Observable, startWith, Subscription } from 'rxjs';

import { EventDetail } from 'src/app/models/event-detail.model';
import { Event as CustomEvent } from 'src/app/models/event.model';
import { ResultStats } from 'src/app/models/result-stats.model';
import { Result } from 'src/app/models/result.model';
import { EventDetailsService } from 'src/app/services/event-details/event-details.service';
import { EventsService } from 'src/app/services/events/events.service';
import { ResultsService } from 'src/app/services/results/results.service';

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

@Component({
	selector: 'app-results',
	templateUrl: './results.component.html',
	styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {

	@ViewChild('genderDistributionChart') private genderDistributionChartRef!: ElementRef;
	genderDistributionChart!: Chart;

	@ViewChild('ageGroupDistributionChart') private ageGroupDistributionChartRef!: ElementRef;
	ageGroupDistributionChart!: Chart;

	activeTab = 1;

	events!: CustomEvent[];
	eventDetails!: EventDetail[];
	results!: Result[];

	genderDistributionLabels: string[] = [];
	genderDistributionData: number[] = [];
	genderDistributionBackgroundColors: string[] = [];

	ageGroupDistributionLabels: string[] = [];
	ageGroupDistributionDataMale: number[] = [];
	ageGroupDistributionDataFemale: number[] = [];

	results$!: Observable<Result[]>;
	filter = new FormControl('', { nonNullable: true });

	constructor(
		private eventsService: EventsService,
		private resultsService: ResultsService,
		private eventDetailsService: EventDetailsService
	) { }

	ngOnInit(): void {
		this.getEvents();
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
								let percentage = (value * 100 / sum) + "%";
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
							label: 'Males',
							data: this.ageGroupDistributionDataMale
						},
						{
							label: 'Females',
							data: this.ageGroupDistributionDataFemale
						}
					]
				},
				options: {
					responsive: true,
					plugins: {
						title: {
							display: true,
							text: 'Age Group Distribution'
						},
					},
					indexAxis: 'y',
					scales: {
						x: {
							beginAtZero: true
						}
					}
				},
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
		const resultSubscription = this.resultsService.getResults(eventDetailId).subscribe((response: any) => {
			this.results = response.results;
			this.results$ = this.filter.valueChanges.pipe(
				startWith(''),
				map(text => this.search(text))
			);
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
				if (!this.ageGroupDistributionLabels.includes(ageGroup.name.slice(1))) {
					this.ageGroupDistributionLabels.push(ageGroup.name.slice(1));
					this.ageGroupDistributionDataFemale.push(0);
					this.ageGroupDistributionDataMale.push(0);
				}
				this.ageGroupDistributionLabels.sort();
				if (ageGroup.name.charAt(0) === 'M') {
					this.ageGroupDistributionDataMale[this.ageGroupDistributionLabels.indexOf(ageGroup.name.slice(1))] = ageGroup.count;
				}
				if (ageGroup.name.charAt(0) === 'F') {
					this.ageGroupDistributionDataFemale[this.ageGroupDistributionLabels.indexOf(ageGroup.name.slice(1))] = ageGroup.count;
				}
			})

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
			this.getResults(selectedEventDetailId);
			this.getStats(selectedEventDetailId);
		}
	}

	getDurationString(seconds: number) {
		const duration = Duration.fromMillis(seconds * 1000);
		return duration.toFormat('hh:mm:ss');
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
