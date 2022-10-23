import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import Chart, { TooltipItem } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import { ResultStats } from 'src/app/models/result-stats.model';

const DEFAULT_GENDER_COLORS: string[] = [
	'rgb(54, 162, 235)',
	'rgb(255, 99, 132)',
	'rgb(255, 205, 86)'
];

@Component({
	selector: 'app-age-group-distribution',
	templateUrl: './age-group-distribution.component.html',
	styleUrls: ['./age-group-distribution.component.scss']
})
export class AgeGroupDistributionComponent implements OnInit {

	@ViewChild('ageGroupDistributionChart') private ageGroupDistributionChartRef!: ElementRef;
	protected ageGroupDistributionChart!: Chart;

	private ageGroupDistributionLabels: string[] = [];
	private ageGroupDistributionDataMale: number[] = [];
	private ageGroupDistributionDataFemale: number[] = [];

	private genderDistributionBackgroundColors: string[] = DEFAULT_GENDER_COLORS;

	private totalMale: number = 0;
	private totalFemale: number = 0;

	constructor() { }

	ngOnInit(): void {
	}

	parseAgeGroupStats(ageGroupStats: ResultStats['ageGroup']): void {
		ageGroupStats.map(ageGroup => {
			const ageRange = ageGroup.name.slice(1);
			if (!this.ageGroupDistributionLabels.includes(ageRange)) {
				this.ageGroupDistributionLabels.push(ageRange);
				this.ageGroupDistributionDataFemale.push(0);
				this.ageGroupDistributionDataMale.push(0);
			}
		});
		this.ageGroupDistributionLabels.sort();
		ageGroupStats.map(ageGroup => {
			const ageRange = ageGroup.name.slice(1);
			const genderInitial = ageGroup.name.charAt(0);
			if (genderInitial === 'M') {
				this.ageGroupDistributionDataMale[this.ageGroupDistributionLabels.indexOf(ageRange)] = -ageGroup.count;
				this.totalMale += ageGroup.count;
			}
			if (genderInitial === 'F') {
				this.ageGroupDistributionDataFemale[this.ageGroupDistributionLabels.indexOf(ageRange)] = ageGroup.count;
				this.totalFemale += ageGroup.count;
			}
		});
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
							hoverBorderColor: this.genderDistributionBackgroundColors[0]
						},
						{
							label: 'Female',
							data: this.ageGroupDistributionDataFemale,
							backgroundColor: this.genderDistributionBackgroundColors[1],
							hoverBackgroundColor: this.genderDistributionBackgroundColors[1],
							hoverBorderColor: this.genderDistributionBackgroundColors[1]
						}
					]
				},
				plugins: [
					ChartDataLabels
				],
				options: {
					responsive: true,
					maintainAspectRatio: false,
					plugins: {
						title: {
							display: true,
							text: 'Age Group Distribution',
							padding: 20,
							font: {
								size: 24
							}
						},
						tooltip: {
							callbacks: {
								title: (c: TooltipItem<'bar'>[]) => {
									const ageRange = c[0].label;
									const genderInitial = c[0].datasetIndex === 0 ? 'M' : 'F';
									return `${genderInitial}${ageRange}`;
								},
								label: (c: TooltipItem<'bar'>) => {
									const value = Number(c.raw);
									const positiveOnly = value < 0 ? -value : value;
									let retStr: string[] = [];
									let genderPercent;
									if (c.datasetIndex === 0) {
										retStr.push(`Male: ${positiveOnly.toString()}`);
										genderPercent = (positiveOnly / this.totalMale) * 100;
									} else {
										retStr.push(`Female: ${positiveOnly.toString()}`);
										genderPercent = (positiveOnly / this.totalFemale) * 100;
									}
									const totalPercent = (positiveOnly / (this.totalMale + this.totalFemale)) * 100;
									retStr.push(`${genderPercent.toFixed(0)}% of gender`);
									retStr.push(`${totalPercent.toFixed(0)}% of total`);
									return retStr;
								}
							}
						},
						datalabels: {
							formatter: (value, _ctx) => {
								return value < 0 ? -value : value;
							},
							anchor: (context) => {
								return context.datasetIndex === 0 ? 'start' : 'end';
							},
							align: (context) => {
								return context.datasetIndex === 0 ? 'start' : 'end';
							},
							color: '#000000',
							font: {
								size: 20
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
							},
							afterDataLimits(scale) {
								scale.max += 7;
								scale.min -= 7;
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

}
