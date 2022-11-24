import { LapDetail } from '../models/lap-detail.model';

export class LapDetailBuilder {

	private id: number = 1;
	private lapNumber: number = 1;
	private lapDistance: number = 5;
	private distanceUnits: string = 'mi';
	private lapTimeSeconds: number = 1000;
	private pitTimeSeconds: number = 100;

	build(): LapDetail {
		return {
			id: this.id,
			lapNumber: this.lapNumber,
			lapDistance: this.lapDistance,
			distanceUnits: this.distanceUnits,
			lapTimeSeconds: this.lapTimeSeconds,
			pitTimeSeconds: this.pitTimeSeconds
		};
	}

}
