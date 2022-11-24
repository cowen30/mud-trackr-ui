import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import createSpyObj = jasmine.createSpyObj;
import SpyObj = jasmine.SpyObj;

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { EventDetailBuilder } from 'src/app/builders/event-detail.builder';
import { EventBuilder } from 'src/app/builders/event.builder';
import { ResultBuilder } from 'src/app/builders/result.builder';
import { EventDetail } from 'src/app/models/event-detail.model';
import { Event } from 'src/app/models/event.model';
import { ResultResponse } from 'src/app/models/result-response';
import { EventDetailsService } from 'src/app/services/event-details/event-details.service';
import { EventsService } from 'src/app/services/events/events.service';
import { ResultsService } from 'src/app/services/results/results.service';
import { MainComponent } from './main.component';

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

	const eventsStub: Event[] = [
		new EventBuilder().build()
	];

	const eventDetailsStub: EventDetail[] = [
		new EventDetailBuilder().build()
	];

	beforeEach(async () => {
		mockEventsService = createSpyObj('EventsService', ['getEvents']);
		mockEventsService.getEvents.and.returnValue(of(eventsStub));

		mockResultsService = createSpyObj('ResultsService', ['getResults', 'searchResults']);
		mockResultsService.getResults.and.returnValue(of());
		mockResultsService.searchResults.and.returnValue(of(dummyResults));

		mockEventDetailsService = createSpyObj('EventDetailsService', ['getEventDetailsByEventId']);
		mockEventDetailsService.getEventDetailsByEventId.and.returnValue(of(eventDetailsStub));

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
	});

	it('should create', () => {
		spyOn(component, 'getEvents');

		fixture.detectChanges();

		expect(component).toBeTruthy();
		expect(component.getEvents).toHaveBeenCalled();
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

	it('should set list of events', () => {
		component.getEvents();
		expect(component.events).toEqual(eventsStub);
	});

	it('should set list of event details', () => {
		component.getEventDetails(1);
		expect(component.eventDetails).toEqual(eventDetailsStub);
	});

	it('should update state when page updated', () => {
		component.page = 2;
		expect(component.page).toBe(2);
	});

	it('should update state when pageSize updated', () => {
		component.pageSize = 50;
		expect(component.pageSize).toBe(50);
	});

	it('should update state when searchTerm updated', () => {
		component.searchTerm = 'test';
		expect(component.searchTerm).toBe('test');
	});

});
