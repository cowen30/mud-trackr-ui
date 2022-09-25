import { Participant } from "./participant.model"

export interface ParticipantResponse {
	metadata: {
		total: number,
		totalPages: number,
		currentPage: number
	},
	participants: Participant[]
}
