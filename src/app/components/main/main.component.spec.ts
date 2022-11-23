import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';

import createSpyObj = jasmine.createSpyObj;
import SpyObj = jasmine.SpyObj;

import { EventDetailsService } from 'src/app/services/event-details/event-details.service';
import { EventsService } from 'src/app/services/events/events.service';
import { ResultsService } from 'src/app/services/results/results.service';
import { MainComponent } from './main.component';
import { ResultResponse } from 'src/app/models/result-response';
import ResultBuilder from 'src/app/builders/result.builder';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { EventBuilder } from 'src/app/builders/event.builder';
import { By } from '@angular/platform-browser';
import EventDetailBuilder from 'src/app/builders/event-detail.builder';

describe('MainComponent', () => {
	let component: MainComponent;
	let fixture: ComponentFixture<MainComponent>;

	let mockEventsService: SpyObj<EventsService>;
	let mockResultsService: SpyObj<ResultsService>;
	let mockEventDetailsService: SpyObj<EventDetailsService>;

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

	beforeEach(async () => {
		mockEventsService = createSpyObj('EventsService', ['getEvents']);
		mockEventsService.getEvents.and.returnValue(of([]));

		mockResultsService = createSpyObj('ResultsService', ['getResults', 'searchResults']);
		mockResultsService.getResults.and.returnValue(of());
		mockResultsService.searchResults.and.returnValue(of(dummyResults));

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
			],
			schemas: [
				CUSTOM_ELEMENTS_SCHEMA
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

	it('should get event details when event selected', () => {
		component.events = [
			new EventBuilder().build()
		];
		fixture.detectChanges();

		spyOn(component, 'getEventDetails');

		const eventSelect = fixture.debugElement.query(By.css('#eventSelect')).nativeElement;
		eventSelect.value = eventSelect.options[1].value;
		eventSelect.dispatchEvent(new Event('change'));

		fixture.detectChanges();

		expect(component.getEventDetails).toHaveBeenCalled();
		expect(component.getEventDetails).toHaveBeenCalledWith(1);
	});

	it('should get results when event detail selected', () => {
		component.eventDetails = [
			new EventDetailBuilder().build()
		];
		fixture.detectChanges();

		spyOn(component, 'getResults');

		const eventDetailSelect = fixture.debugElement.query(By.css('#eventDetailSelect')).nativeElement;
		eventDetailSelect.value = eventDetailSelect.options[1].value;
		eventDetailSelect.dispatchEvent(new Event('change'));

		fixture.detectChanges();

		expect(component.getResults).toHaveBeenCalled();
	});

});
