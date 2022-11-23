import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import Chart from 'chart.js/auto';

import { DurationHelper } from 'src/app/helpers/duration.helper';
import { LapDetail } from 'src/app/models/lap-detail.model';

@Component({
	selector: 'app-result-progression',
	templateUrl: './result-progression.component.html'
})
export class ResultProgressionComponent implements OnInit {

	@Input('lapDetails') lapDetails: LapDetail[] = [];
	private eventFinishSeconds: number = 12 * 60 * 60; // TODO: read from API

	private _resultDetailModalShown = new BehaviorSubject<boolean>(false);

	@Input('resultDetailModalShown') set resultDetailModalShown(value: boolean) {
		this._resultDetailModalShown.next(value);
	}

	get resultDetailModalShown() {
		return this._resultDetailModalShown.getValue();
	}

	@ViewChild('resultProgressionChart') private resultProgressionChartRef!: ElementRef;
	resultProgressionChart!: Chart;

	constructor(
		private durationHelper: DurationHelper
	) { }

	ngOnInit(): void {
		this._resultDetailModalShown.subscribe((resultDetailModalShown: boolean) => {
			if (resultDetailModalShown) {
				this.generateProgressionChart(this.lapDetails);
			}
		})
	}

	formatLapDetails(lapDetails: LapDetail[]): { x: number, y: number }[] {
		// Set initial point at 0,0
		let timeDistancePoints: { x: number, y: number }[] = [
			{
				x: 0,
				y: 0
			}
		];
		let cumulativeTime = 0;
		let cumulativeDistance = 0;
		lapDetails.forEach(lapDetail => {
			// Accumulate distance and time
			cumulativeDistance += lapDetail.lapDistance;
			cumulativeTime += lapDetail.lapTimeSeconds;

			// Add lap info
			timeDistancePoints.push({
				x: cumulativeTime,
				y: cumulativeDistance
			});

			cumulativeTime += lapDetail.pitTimeSeconds;

			// Add pit info
			timeDistancePoints.push({
				x: cumulativeTime,
				y: cumulativeDistance
			});
		});
		return timeDistancePoints;
	}

	generateProgressionChart(lapDetails: LapDetail[]): void {
		this.resultProgressionChart = new Chart(this.resultProgressionChartRef.nativeElement, {
			type: 'scatter',
			data: {
				datasets: [{
					label: 'Progression',
					data: this.formatLapDetails(lapDetails),
					backgroundColor: 'rgb(54, 162, 235)',
					showLine: true
				}]
			},
			options: {
				responsive: true,
				elements: {
					line: {
						backgroundColor: 'rgb(54, 162, 235)',
						borderColor: 'rgb(54, 162, 235)'
					}
				},
				scales: {
					x: {
						beginAtZero: true,
						type: 'linear',
						position: 'bottom',
						max: this.eventFinishSeconds,
						ticks: {
							stepSize: this.eventFinishSeconds / 6,
							callback: (value, _index, _ticks) => {
								return this.durationHelper.getDurationString(Number(value));
							}
						},
						title: {
							display: true,
							text: 'Time'
						}
					},
					y: {
						beginAtZero: true,
						ticks: {
							stepSize: 5
						},
						title: {
							display: true,
							text: this.getYAxisTitle(lapDetails[0].distanceUnits)
						}
					}
				},
				plugins: {
					title: {
						display: false
					},
					legend: {
						display: false
					},
					tooltip: {
						enabled: false
					}
				}
			}
		});
	}

	private getYAxisTitle(distanceUnits: string | undefined): string {
		const units = (distanceUnits != null) ? ` (${distanceUnits})` : '';
		return `Distance${units}`;
	}

}
