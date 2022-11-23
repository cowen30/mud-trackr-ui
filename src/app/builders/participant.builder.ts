import { Participant } from '../models/participant.model';
import { Person } from '../models/person.model';
import PersonBuilder from './person.builder';

export default class ParticipantBuilder {

	private id: number = 1;
	private person: Person = new PersonBuilder().build();
	private bibNumber: string = '123';
	private gender: string = 'F';
	private age: number = 34;
	private ageGroup: string = 'test';

	build(): Participant {
		return {
			id: this.id,
			person: this.person,
			bibNumber: this.bibNumber,
			gender: this.gender,
			age: this.age,
			ageGroup: this.ageGroup
		};
	}

}
