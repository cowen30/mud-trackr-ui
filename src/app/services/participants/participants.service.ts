import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ParticipantResponse } from 'src/app/models/participant-response.model';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class ParticipantsService {

	baseUrl = environment.serviceUrl;

	constructor(private http: HttpClient) { }

	getParticipants(eventDetailId: number, page: number): Observable<ParticipantResponse> {
		const params = new HttpParams()
			.set('eventDetailId', eventDetailId)
			.set('page', page);
		return this.http.get<ParticipantResponse>(`${this.baseUrl}/participants`, { params: params });
	}

}
