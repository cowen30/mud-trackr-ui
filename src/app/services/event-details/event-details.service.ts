import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EventDetail } from 'src/app/models/event-detail.model';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class EventDetailsService {

	baseUrl = environment.serviceUrl;

	constructor(private http: HttpClient) { }

	getEventDetailsByEventId(eventId: number): Observable<EventDetail[]> {
		const params = new HttpParams().set('eventId', eventId);
		return this.http.get<EventDetail[]>(`${this.baseUrl}/event-details`, { params: params });
	}

}
