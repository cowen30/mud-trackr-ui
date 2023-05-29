import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { ResultStats } from 'src/app/models/result-stats.model';
import { ResultsService } from 'src/app/services/results/results.service';
import { AgeGroupDistributionComponent } from './age-group-distribution/age-group-distribution.component';
import { GenderDistributionComponent } from './gender-distribution/gender-distribution.component';

@Component({
	selector: 'app-stats',
	templateUrl: './stats.component.html'
})
export class StatsComponent implements OnInit {

	private _eventDetailId = new BehaviorSubject<number>(0);

	@Input('eventDetailId') set eventDetailId(value: number) {
		this._eventDetailId.next(value);
	}

	get eventDetailId() {
		return this._eventDetailId.getValue();
	}

	@ViewChild('genderDistributionComponent') private genderDistributionComponent!: GenderDistributionComponent;
	@ViewChild('ageGroupDistributionComponent') private ageGroupDistributionComponent!: AgeGroupDistributionComponent;

	constructor(
		private resultsService: ResultsService
	) { }

	ngOnInit(): void {
		this._eventDetailId.subscribe((eventDetailId: number) => {
			if (!Number.isNaN(eventDetailId)) {
				this.getStats(eventDetailId);
			}
		});
	}

	getStats(eventDetailId: number): void {
		const statsSubscription = this.resultsService.getStats(eventDetailId).subscribe((response: ResultStats) => {
			this.genderDistributionComponent.parseGenderStats(response.gender);
			this.ageGroupDistributionComponent.parseAgeGroupStats(response.ageGroup);
		});

		setTimeout(() => {
			statsSubscription.unsubscribe();
		}, 5000);
	}

	displayCharts(): void {
		this.genderDistributionComponent.generateGenderDistributionChart();
		this.ageGroupDistributionComponent.generateAgeGroupDistributionChart();
	}

}
