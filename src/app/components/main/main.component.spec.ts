import { ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';
import createSpyObj = jasmine.createSpyObj;
import SpyObj = jasmine.SpyObj;

import { MainComponent } from './main.component';
import { EventsService } from 'src/app/services/events/events.service';
import { ResultsService } from 'src/app/services/results/results.service';
import { EventDetailsService } from 'src/app/services/event-details/event-details.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

describe('MainComponent', () => {
	let component: MainComponent;
	let fixture: ComponentFixture<MainComponent>;

	let mockEventsService: SpyObj<EventsService>;
	let mockResultsService: SpyObj<ResultsService>;
	let mockEventDetailsService: SpyObj<EventDetailsService>;

	beforeEach(async () => {
		mockEventsService = createSpyObj('EventsService', ['getEvents']);
		mockEventsService.getEvents.and.returnValue(of([]));

		mockResultsService = createSpyObj('ResultsService', ['getResults', 'getStats']);
		mockResultsService.getResults.and.returnValue(of({ results: []}));
		mockResultsService.getStats.and.returnValue(of());

		mockEventDetailsService = createSpyObj('EventDetailsService', ['getEventDetailsByEventId']);
		mockEventDetailsService.getEventDetailsByEventId.and.returnValue(of());

		await TestBed.configureTestingModule({
			declarations: [
				MainComponent
			],
			providers: [
				{
					provide: EventsService,
					useValue: mockEventsService
				},
				{
					provide: ResultsService,
					useValue: mockResultsService
				},
				{
					provide: EventDetailsService,
					useValue: mockEventDetailsService
				}
			],
			imports: [
				NgbModule
			]
		})
		.compileComponents();

		fixture = TestBed.createComponent(MainComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

});
