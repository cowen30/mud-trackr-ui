import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

}
