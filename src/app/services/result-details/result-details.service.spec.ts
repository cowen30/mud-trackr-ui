import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ResultDetailsService } from './result-details.service';

describe('ResultDetailsService', () => {
	let resultDetailsService: ResultDetailsService;
	let httpMock: HttpTestingController;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule
			]
		});
		resultDetailsService = TestBed.inject(ResultDetailsService);
		httpMock = TestBed.inject(HttpTestingController);
	});

	afterEach(() => {
		httpMock.verify();
	});

	it('should be created', () => {
		expect(resultDetailsService).toBeTruthy();
	});

});
