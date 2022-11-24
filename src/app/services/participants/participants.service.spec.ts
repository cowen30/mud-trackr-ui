import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ParticipantBuilder } from 'src/app/builders/participant.builder';
import { ParticipantResponse } from 'src/app/models/participant-response.model';
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
		const dummyParticipants: ParticipantResponse = {
			metadata: {
				total: 10,
				totalPages: 1,
				currentPage: 1
			},
			participants: [
				new ParticipantBuilder().build()
			]
		};

		participantsService.getParticipants(1, 1).subscribe(participantResponse => {
			expect(participantResponse.participants.length).toBe(1);
			expect(participantResponse).toEqual(dummyParticipants);
		});
		const req = httpMock.expectOne('http://localhost:3000/participants?eventDetailId=1&page=1');

		expect(req.request.method).toBe('GET');
		req.flush(dummyParticipants);
	});

});
