import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { EventsService } from './events.service';
import { Event } from 'src/app/models/event.model';

describe('EventsService', () => {
	let eventsService: EventsService;
	let httpMock: HttpTestingController;

	beforeEach(async () => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
			]
		}).compileComponents();

		eventsService = TestBed.inject(EventsService);
		httpMock = TestBed.inject(HttpTestingController);
	});

	afterEach(() => {
		httpMock.verify();
	})

	it('should be created', () => {
		expect(eventsService).toBeTruthy();
	});

	it('should call getEvents', () => {
		const dummyEvents: Event[] = [
			{
				id: 1,
				name: 'Event Name',
				address: 'test',
				locality: 'test',
				region: 'test',
				country: 'test',
				postalCode: 'test',
				date: new Date()
			}
		];

		eventsService.getEvents().subscribe(events => {
			expect(events.length).toBe(1);
			expect(events).toEqual(dummyEvents);
		});
		const req = httpMock.expectOne(`http://localhost:3000/events`);

		expect(req.request.method).toBe('GET');
		req.flush(dummyEvents);
	});
});
