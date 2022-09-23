import { Result } from "./result.model"

export interface ResultResponse {
	metadata: {
		total: number,
		totalPages: number,
		currentPage: number
	},
	results: Result[]
}
