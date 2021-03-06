import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Participant } from 'src/app/models/participant.model';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class ParticipantService {

	baseUrl = environment.serviceUrl;

	constructor(private http: HttpClient) { }

	getParticipantsByUserId(userId: number): Observable<Participant[]> {
		let params = new HttpParams().set('userId', userId);
		return this.http.get<Participant[]>(`${this.baseUrl}/participants`, { params: params });
	}

	getParticipantsByEventId(eventId: number): Observable<Participant[]> {
		let params = new HttpParams().set('eventId', eventId);
		return this.http.get<Participant[]>(`${this.baseUrl}/participants`, { params: params });
	}

	addParticipant(participant: Participant): Observable<Participant> {
		return this.http.post<Participant>(`${this.baseUrl}/participants`, { participant: participant });
	}

	editParticipant(participant: Participant): Observable<Participant> {
		const { ['id']: participantId, ...participantData } = participant;
		return this.http.patch<Participant>(`${this.baseUrl}/participants/${participantId}`, { participant: participantData });
	}

	deleteParticipant(participantId: number): Observable<any> {
		return this.http.delete<any>(`${this.baseUrl}/participants/${participantId}`);
	}

	getTmLegionnaireCountForUser(userId: number): Observable<number> {
		return this.http.get<number>(`${this.baseUrl}/participants/users/${userId.toString()}/legionnaire`);
	}

}
