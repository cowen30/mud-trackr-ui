import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import ResultBuilder from 'src/app/helpers/builders/result.builder';
import { ResultResponse } from 'src/app/models/result-response';
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
				ResultBuilder.buildResult()
			]
		};

		resultsService.getResults(1, 1).subscribe(results => {
			expect(results.results.length).toBe(1);
			expect(results).toEqual(dummyResults);
		});
		const req = httpMock.expectOne(`http://localhost:3000/results?eventDetailId=1&page=1`);

		expect(req.request.method).toBe('GET');
		req.flush(dummyResults);
	});

});
