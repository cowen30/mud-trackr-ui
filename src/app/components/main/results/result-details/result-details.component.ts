import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DurationHelper } from 'src/app/helpers/duration.helper';
import { Result } from 'src/app/models/result.model';

@Component({
	selector: 'app-result-details',
	templateUrl: './result-details.component.html',
	styleUrls: ['./result-details.component.scss']
})
export class ResultDetailsComponent {

	@Input() result!: Result;

	constructor(
		public activeModal: NgbActiveModal,
		public durationHelper: DurationHelper
	) {}

}
