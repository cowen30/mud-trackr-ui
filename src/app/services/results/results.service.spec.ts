import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ResultStatus } from 'src/app/enums/result-status.enum';
import { Result } from 'src/app/models/result.model';

import { ResultsService } from './results.service';

describe('ResultsService', () => {
	let resultsService: ResultsService;
	let httpMock: HttpTestingController;

	beforeEach(async () => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
			]
		}).compileComponents();

		resultsService = TestBed.inject(ResultsService);
		httpMock = TestBed.inject(HttpTestingController);
	});

	afterEach(() => {
		httpMock.verify();
	});

	it('should be created', () => {
		expect(resultsService).toBeTruthy();
	});

	it('should call getResults', () => {
		const dummyResults: { results: Result[] } = {
			results: [
				{
					id: 1,
					placeOverall: 1,
					placeGender: 1,
					placeAgeGroup: 1,
					status: ResultStatus.FINISHED,
					participant: {
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
					},
					lapsTotal: 3,
					distanceTotal: 10,
					timeTotalSeconds: 12345
				}
			]
		};

		resultsService.getResults(1).subscribe(results => {
			expect(results.results.length).toBe(1);
			expect(results).toEqual(dummyResults);
		});
		const req = httpMock.expectOne(`http://localhost:3000/results?eventDetailId=1`);

		expect(req.request.method).toBe('GET');
		req.flush(dummyResults);
	});

});
