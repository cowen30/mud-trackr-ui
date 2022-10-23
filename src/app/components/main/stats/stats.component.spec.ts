import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import createSpyObj = jasmine.createSpyObj;
import SpyObj = jasmine.SpyObj;

import { StatsComponent } from './stats.component';
import { ResultsService } from 'src/app/services/results/results.service';

describe('StatsComponent', () => {
	let component: StatsComponent;
	let fixture: ComponentFixture<StatsComponent>;

	let mockResultsService: SpyObj<ResultsService>;

	beforeEach(async () => {
		mockResultsService = createSpyObj('ResultsService', ['getStats']);
		mockResultsService.getStats.and.returnValue(of());

		await TestBed.configureTestingModule({
			declarations: [
				StatsComponent
			],
			providers: [
				{
					provide: ResultsService,
					useValue: mockResultsService
				}
			]
		})
		.compileComponents();

		fixture = TestBed.createComponent(StatsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

});
