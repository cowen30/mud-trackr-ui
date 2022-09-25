import { ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';
import createSpyObj = jasmine.createSpyObj;
import SpyObj = jasmine.SpyObj;

import { ParticipantsService } from 'src/app/services/participants/participants.service';
import { ParticipantsComponent } from './participants.component';

describe('ParticipantsComponent', () => {
	let component: ParticipantsComponent;
	let mockParticipantsService: SpyObj<ParticipantsService>;
	let fixture: ComponentFixture<ParticipantsComponent>;

	beforeEach(async () => {
		mockParticipantsService = createSpyObj('ParticipantsService', ['getParticipants']);
		mockParticipantsService.getParticipants.and.returnValue(of());

		await TestBed.configureTestingModule({
			declarations: [
				ParticipantsComponent
			],
			providers: [
				{
					provide: ParticipantsService,
					useValue: mockParticipantsService
				}
			]
		})
		.compileComponents();

		fixture = TestBed.createComponent(ParticipantsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

});
