import { ResultStatus } from "../enums/result-status.enum";
import { Participant } from "./participant.model";

export interface Result {
	id: number,
	placeOverall: number,
	placeGender: number,
	placeAgeGroup: number,
	status: ResultStatus,
	participant: Participant,
	lapsTotal: number,
	distanceTotal: number,
	distanceUnits: string,
	timeTotalSeconds: number
}
