import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import { ResultStats } from 'src/app/models/result-stats.model';

const DEFAULT_GENDER_LABELS: string[] = [
	'Male',
	'Female',
	'Other'
];

const DEFAULT_GENDER_COLORS: string[] = [
	'rgb(54, 162, 235)',
	'rgb(255, 99, 132)',
	'rgb(255, 205, 86)'
];

@Component({
	selector: 'app-gender-distribution',
	templateUrl: './gender-distribution.component.html'
})
export class GenderDistributionComponent implements OnInit {

	@ViewChild('genderDistributionChart') private genderDistributionChartRef!: ElementRef;
	protected genderDistributionChart!: Chart;

	private genderDistributionLabels: string[] = [];
	private genderDistributionData: number[] = [];
	private genderDistributionBackgroundColors: string[] = [];

	constructor() { /* No implementation required */  }

	ngOnInit(): void {
		// No implementation required
	}

	parseGenderStats(genderStats: ResultStats['gender']): void {
		this.genderDistributionLabels = DEFAULT_GENDER_LABELS.filter((_, index) => {
			return Object.values(genderStats)[index] > 0
		});
		this.genderDistributionData = Object.values(genderStats).filter(gender => {
			return gender > 0;
		});
		this.genderDistributionBackgroundColors = DEFAULT_GENDER_COLORS.filter((_, index) => {
			return Object.values(genderStats)[index] > 0
		});
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
							text: 'Gender Distribution',
							padding: 20,
							font: {
								size: 24
							}
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
								dataArray.forEach(data => {
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

}
