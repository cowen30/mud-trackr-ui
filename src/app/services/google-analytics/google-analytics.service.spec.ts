import { TestBed } from '@angular/core/testing';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { ReplaySubject } from 'rxjs';

import { EnvironmentService } from '../environment/environment.service';
import { GoogleAnalyticsService } from './google-analytics.service';


describe('GoogleAnalyticsService', () => {

	let service: GoogleAnalyticsService;
	let routerEventReplaySubject: ReplaySubject<RouterEvent>;
  	let routerMock;
	let environmentServiceSpy: jasmine.SpyObj<EnvironmentService>;

	beforeEach(async () => {
		routerEventReplaySubject = new ReplaySubject<RouterEvent>(1);
		routerMock = {
			events: routerEventReplaySubject.asObservable()
		};
		environmentServiceSpy = jasmine.createSpyObj('EnvironmentService', [], { googleAnalyticsMeasurementId: '1234567890' });
		await TestBed.configureTestingModule({
			providers: [
				{ provide: Router, useValue: routerMock },
				{ provide: EnvironmentService, useValue: environmentServiceSpy }
			]
		}).compileComponents();

		service = TestBed.inject(GoogleAnalyticsService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should call gtag function', () => {
		service.init();
		routerEventReplaySubject.next(new NavigationEnd(1, 'http://localhost:4200', 'redirectUrl'));
		expect(document.head.querySelector('script[src="https://www.googletagmanager.com/gtag/js?id=1234567890"]')).toBeTruthy();
	});

});
