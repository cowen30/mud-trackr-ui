import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { DurationHelper } from 'src/app/helpers/duration.helper';
import { LapDetail } from 'src/app/models/lap-detail.model';
import { Result } from 'src/app/models/result.model';
import { ResultDetailsService } from 'src/app/services/result-details/result-details.service';

@Component({
	selector: 'app-result-details',
	templateUrl: './result-details.component.html',
	styleUrls: ['./result-details.component.scss']
})
export class ResultDetailsComponent implements OnInit {

	private _currentResult!: Result;

	private _result: ReplaySubject<Result> = new ReplaySubject<Result>(1);

	@Input('result') set result(value: Result) {
		this._result.next(value);
		this._currentResult = value;
	}

	get result(): Result {
		return this._currentResult;
	}

	private _resultDetailModalShown = new BehaviorSubject<boolean>(false);

	@Input('resultDetailModalShown') set resultDetailModalShown(value: boolean) {
		this._resultDetailModalShown.next(value);
	}

	get resultDetailModalShown() {
		return this._resultDetailModalShown.getValue();
	}

	constructor(
		public activeModal: NgbActiveModal,
		public durationHelper: DurationHelper,
		private resultDetailsService: ResultDetailsService
	) {}

	ngOnInit(): void {
		this._result.subscribe((result) => {
			if (result != null) {
				this.resultDetailsService.getResultDetails(result.id).subscribe((lapDetails: LapDetail[]) => {
					this._currentResult.lapDetails = lapDetails;
				});
			}
		});
	}

}
