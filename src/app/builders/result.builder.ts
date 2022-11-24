import { ResultStatus } from 'src/app/enums/result-status.enum';
import { LapDetail } from '../models/lap-detail.model';
import { Participant } from '../models/participant.model';
import { Result } from '../models/result.model';
import { ParticipantBuilder } from './participant.builder';

export class ResultBuilder {

	private id: number = 1;
	private placeOverall: number = 1;
	private placeGender: number = 1;
	private placeAgeGroup: number = 1;
	private status: ResultStatus = ResultStatus.FINISHED;
	private participant: Participant = new ParticipantBuilder().build();
	private lapsTotal: number = 3;
	private distanceTotal: number = 10;
	private distanceUnits: string = 'km';
	private timeTotalSeconds: number = 12345;
	private lapDetails: LapDetail[] = [];

	build(): Result {
		return {
			id: this.id,
			placeOverall: this.placeOverall,
			placeGender: this.placeGender,
			placeAgeGroup: this.placeAgeGroup,
			status: this.status,
			participant: this.participant,
			lapsTotal: this.lapsTotal,
			distanceTotal: this.distanceTotal,
			distanceUnits: this.distanceUnits,
			timeTotalSeconds: this.timeTotalSeconds,
			lapDetails: this.lapDetails
		};
	}

}
