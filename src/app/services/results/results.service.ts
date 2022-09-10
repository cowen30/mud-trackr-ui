import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultStats } from 'src/app/models/result-stats.model';
import { environment } from 'src/environments/environment';
import { Result } from '../../models/result.model';

@Injectable({
	providedIn: 'root'
})
export class ResultsService {

	baseUrl = environment.serviceUrl;

	constructor(private http: HttpClient) { }

	getResults(eventDetailId: number): Observable<any> {
		const params = new HttpParams().set('eventDetailId', eventDetailId);
		return this.http.get<any>(`${this.baseUrl}/results`, { params: params });
	}

	getStats(eventDetailId: number): Observable<ResultStats> {
		const params = new HttpParams().set('eventDetailId', eventDetailId);
		return this.http.get<ResultStats>(`${this.baseUrl}/results/stats`, { params: params });
	}

}
