import { Person } from '../models/person.model';

export default class PersonBuilder {

	private id: number = 1;
	private name: string = 'test';
	private firstName: string = 'test';
	private lastName: string = 'test';

	build(): Person {
		return {
			id: this.id,
			name: this.name,
			firstName: this.firstName,
			lastName: this.lastName
		};
	}

}
