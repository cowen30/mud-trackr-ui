import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {

	private _googleAnalyticsMeasurementId!: string;

	constructor() {
		this._googleAnalyticsMeasurementId = environment.googleAnalyticsMeasurementId;
	}

	public get googleAnalyticsMeasurementId(): string {
		return this._googleAnalyticsMeasurementId;
	}

}
