import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Participant } from 'src/app/models/participant.model';

import { ParticipantsService } from './participants.service';

describe('ParticipantsService', () => {
	let participantsService: ParticipantsService;
	let httpMock: HttpTestingController;

	beforeEach(async () => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
			]
		}).compileComponents();

		participantsService = TestBed.inject(ParticipantsService);
		httpMock = TestBed.inject(HttpTestingController);
	});

	afterEach(() => {
		httpMock.verify();
	});

	it('should be created', () => {
		expect(participantsService).toBeTruthy();
	});

	it('should call getEvents', () => {
		const dummyParticipants: Participant[] = [
			{
				id: 1,
				person: {
					id: 1,
					name: 'test',
					firstName: 'test',
					lastName: 'test'
				},
				bibNumber: '123',
				gender: 'F',
				age: 34,
				ageGroup: 'test'
			}
		];

		participantsService.getParticipants(1).subscribe(participants => {
			expect(participants.length).toBe(1);
			expect(participants).toEqual(dummyParticipants);
		});
		const req = httpMock.expectOne(`http://localhost:3000/participants?eventDetailId=1`);

		expect(req.request.method).toBe('GET');
		req.flush(dummyParticipants);
	});

});
