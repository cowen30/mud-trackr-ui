import { Person } from "./person.model";

export interface Participant {
	id: number,
	person: Person,
	bibNumber: string,
	gender: string,
	age: number
}
