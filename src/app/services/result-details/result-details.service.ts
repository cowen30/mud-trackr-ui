import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LapDetail } from 'src/app/models/lap-detail.model';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class ResultDetailsService {

	baseUrl = environment.serviceUrl;

	constructor(private http: HttpClient) { }

	getResultDetails(resultId: number): Observable<LapDetail[]> {
		return this.http.get<any>(`${this.baseUrl}/results/${resultId}/details`);
	}

}
