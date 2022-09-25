import { Participant } from "src/app/models/participant.model";

export default class ParticipantBuilder {

	static buildParticipant(): Participant {
		return {
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
		}
	}

}
