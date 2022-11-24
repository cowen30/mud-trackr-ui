import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ResultBuilder } from 'src/app/builders/result.builder';
import { ResultResponse } from 'src/app/models/result-response';
import { ResultStats } from 'src/app/models/result-stats.model';
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
		const dummyResults: ResultResponse = {
			metadata: {
				total: 10,
				totalPages: 1,
				currentPage: 1
			},
			results: [
				new ResultBuilder().build()
			]
		};

		resultsService.getResults(1, 1).subscribe(resultResponse => {
			expect(resultResponse.results.length).toBe(1);
			expect(resultResponse).toEqual(dummyResults);
		});
		const req = httpMock.expectOne('http://localhost:3000/results?eventDetailId=1&page=1');

		expect(req.request.method).toBe('GET');
		req.flush(dummyResults);
	});

	it('should call searchResults', () => {
		const dummyResults: ResultResponse = {
			metadata: {
				total: 10,
				totalPages: 1,
				currentPage: 1
			},
			results: [
				new ResultBuilder().build()
			]
		};

		resultsService.searchResults(1, 'name', 1).subscribe(resultResponse => {
			expect(resultResponse.results.length).toBe(1);
			expect(resultResponse).toEqual(dummyResults);
		});
		const req = httpMock.expectOne('http://localhost:3000/results?eventDetailId=1&search=name&page=1');

		expect(req.request.method).toBe('GET');
		req.flush(dummyResults);
	});

	it('should call getStats', () => {
		const dummyStats: ResultStats = {
			gender: {
				male: 10,
				female: 10,
				other: 0
			},
			ageGroup: [
				{
					name: 'M20-24',
					count: 5
				}
			]
		};

		resultsService.getStats(1).subscribe(statsResponse => {
			expect(statsResponse.ageGroup.length).toBe(1);
			expect(statsResponse).toEqual(dummyStats);
		});
		const req = httpMock.expectOne('http://localhost:3000/results/stats?eventDetailId=1');

		expect(req.request.method).toBe('GET');
		req.flush(dummyStats);
	});

});
