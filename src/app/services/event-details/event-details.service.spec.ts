import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { EventDetail } from 'src/app/models/event-detail.model';
import { EventDetailsService } from './event-details.service';

describe('EventDetailsService', () => {
	let eventDetailsService: EventDetailsService;
	let httpMock: HttpTestingController;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
			]
		}).compileComponents();

		eventDetailsService = TestBed.inject(EventDetailsService);
		httpMock = TestBed.inject(HttpTestingController);
	});

	afterEach(() => {
		httpMock.verify();
	});

	it('should be created', () => {
		expect(eventDetailsService).toBeTruthy();
	});

	it('should call getEventDetails', () => {
		const dummyEventDetails: EventDetail[] = [
			{
				id: 1,
				event: {
					id: 1,
					name: 'Event Name',
					address: 'test',
					locality: 'test',
					region: 'test',
					country: 'test',
					postalCode: 'test',
					date: new Date()
				},
				eventType: {
					id: 1,
					name: 'test',
					shortName: 'test'
				},
				startDate: new Date(),
				endDate: new Date(),
				lapDistance: 10,
				distanceUnits: 'km',
				lapElevation: 300,
				elevationUnits: 'ft'
			}
		];

		eventDetailsService.getEventDetailsByEventId(1).subscribe(eventDetails => {
			expect(eventDetails.length).toBe(1);
			expect(eventDetails).toEqual(dummyEventDetails);
		});
		const req = httpMock.expectOne(`http://localhost:3000/event-details?eventId=1`);

		expect(req.request.method).toBe('GET');
		req.flush(dummyEventDetails);
	});

});
