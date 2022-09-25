import { Component, Input, OnInit } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { ParticipantResponse } from 'src/app/models/participant-response.model';

import { Participant } from 'src/app/models/participant.model';
import { ParticipantsService } from 'src/app/services/participants/participants.service';

const FILTER_PAG_REGEX = /\D/g;

@Component({
	selector: 'app-participants',
	templateUrl: './participants.component.html',
	styleUrls: ['./participants.component.scss']
})
export class ParticipantsComponent implements OnInit {

	private _eventDetailId = new BehaviorSubject<number>(0);

	@Input('eventDetailId') set eventDetailId(value: number) {
		this._eventDetailId.next(value);
	}

	get eventDetailId() {
		return this._eventDetailId.getValue();
	}

	participants!: Participant[];

	page = 1;
	totalParticipants = 0;

	constructor(
		private participantsService: ParticipantsService
	) { }

	ngOnInit(): void {
		this._eventDetailId.subscribe((eventDetailId: number) => {
			if (!Number.isNaN(eventDetailId)) {
				this.getParticipants(eventDetailId);
			}
		});
	}

	selectPage(page: string) {
		this.page = parseInt(page, 10) || 1;
	}

	formatInput(input: HTMLInputElement) {
		input.value = input.value.replace(FILTER_PAG_REGEX, '');
	}

	getParticipants(eventDetailId: number) {
		this.participantsService.getParticipants(eventDetailId, this.page).subscribe((participantResponse: ParticipantResponse) => {
			this.participants = participantResponse.participants;
			this.totalParticipants = participantResponse.metadata.total;
		});
	}

}
