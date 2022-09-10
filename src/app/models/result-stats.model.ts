export interface ResultStats {
	gender: {
		male: number,
		female: number,
		other: number
	},
	ageGroup: [
		{
			name: string,
			count: number
		}
	]
}
