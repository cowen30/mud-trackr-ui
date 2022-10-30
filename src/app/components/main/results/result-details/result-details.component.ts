import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { DurationHelper } from 'src/app/helpers/duration.helper';
import { Result } from 'src/app/models/result.model';

@Component({
	selector: 'app-result-details',
	templateUrl: './result-details.component.html',
	styleUrls: ['./result-details.component.scss']
})
export class ResultDetailsComponent {

	@Input() result!: Result;

	private _resultDetailModalShown = new BehaviorSubject<boolean>(false);

	@Input('resultDetailModalShown') set resultDetailModalShown(value: boolean) {
		this._resultDetailModalShown.next(value);
	}

	get resultDetailModalShown() {
		return this._resultDetailModalShown.getValue();
	}

	constructor(
		public activeModal: NgbActiveModal,
		public durationHelper: DurationHelper
	) {}

}
