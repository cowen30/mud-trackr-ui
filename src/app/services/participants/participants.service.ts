import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Participant } from 'src/app/models/participant.model';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class ParticipantsService {

	baseUrl = environment.serviceUrl;

	constructor(private http: HttpClient) { }

	getParticipants(eventDetailId: number): Observable<Participant[]> {
		const params = new HttpParams().set('eventDetailId', eventDetailId);
		return this.http.get<Participant[]>(`${this.baseUrl}/participants`, { params: params });
	}

}
