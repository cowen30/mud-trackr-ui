import { ResultStatus } from "src/app/enums/result-status.enum";
import { Result } from "src/app/models/result.model";

export default class ResultBuilder {

	static buildResult(): Result {
		return {
			id: 1,
			placeOverall: 1,
			placeGender: 1,
			placeAgeGroup: 1,
			status: ResultStatus.FINISHED,
			participant: {
				id: 1,
				person: {
					id: 1,
					name: 'test',
					firstName: 'test',
					lastName: 'test'
				},
				bibNumber: '123',
				gender: 'F',
				age: 34,
				ageGroup: 'test'
			},
			lapsTotal: 3,
			distanceTotal: 10,
			distanceUnits: 'km',
			timeTotalSeconds: 12345,
			lapDetails: []
		}
	}

}
