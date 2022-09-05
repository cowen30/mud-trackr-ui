import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Event } from 'src/app/models/event.model';

@Injectable({
	providedIn: 'root'
})
export class EventsService {

	baseUrl = environment.serviceUrl;

	constructor(private http: HttpClient) { }

	getEvents(): Observable<Event[]> {
		return this.http.get<Event[]>(`${this.baseUrl}/events`);
	}

}
