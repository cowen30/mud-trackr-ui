import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { LapDetail } from 'src/app/models/lap-detail.model';
import { ResultDetailsService } from './result-details.service';

describe('ResultDetailsService', () => {
	let resultDetailsService: ResultDetailsService;
	let httpMock: HttpTestingController;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule
			]
		}).compileComponents();

		resultDetailsService = TestBed.inject(ResultDetailsService);
		httpMock = TestBed.inject(HttpTestingController);
	});

	afterEach(() => {
		httpMock.verify();
	});

	it('should be created', () => {
		expect(resultDetailsService).toBeTruthy();
	});

	it('should call getResultDetails', () => {
		const dummyResult: LapDetail[] = [
			{
				id: 1,
				lapNumber: 1,
				lapDistance: 5,
				distanceUnits: 'mi',
				lapTimeSeconds: 100,
				pitTimeSeconds: 0
			}
		];

		resultDetailsService.getResultDetails(1).subscribe(resultDetailsResponse => {
			expect(resultDetailsResponse.length).toBe(1);
			expect(resultDetailsResponse).toEqual(dummyResult);
		});
		const req = httpMock.expectOne('http://localhost:3000/results/1/details');

		expect(req.request.method).toBe('GET');
		req.flush(dummyResult);
	});

});
