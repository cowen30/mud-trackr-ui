import { Component, Input, OnInit } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { Participant } from 'src/app/models/participant.model';
import { ParticipantsService } from 'src/app/services/participants/participants.service';

@Component({
	selector: 'app-participants',
	templateUrl: './participants.component.html',
	styleUrls: ['./participants.component.scss']
})
export class ParticipantsComponent implements OnInit {

	private _eventDetailId = new BehaviorSubject<number>(0);

	@Input('eventDetailId') set event(value: number) {
		this._eventDetailId.next(value);
	}

	get event() {
		return this._eventDetailId.getValue();
	}

	participants!: Participant[];

	constructor(
		private participantsService: ParticipantsService
	) { }

	ngOnInit(): void {
		this._eventDetailId.subscribe((eventDetailId: number) => {
			if (!Number.isNaN(eventDetailId)) {
				this.participantsService.getParticipants(eventDetailId).subscribe((participants: Participant[]) => {
					this.participants = participants;
				});
			}
		});
	}

}
