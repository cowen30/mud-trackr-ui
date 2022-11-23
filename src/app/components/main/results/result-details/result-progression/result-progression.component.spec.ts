import { ComponentFixture, TestBed } from '@angular/core/testing';
import LapDetailBuilder from 'src/app/builders/lap-detail.builder';
import { LapDetail } from 'src/app/models/lap-detail.model';

import { ResultProgressionComponent } from './result-progression.component';

describe('ResultProgressionComponent', () => {
	let component: ResultProgressionComponent;
	let fixture: ComponentFixture<ResultProgressionComponent>;

	let lapDetailsStub: LapDetail[] = [
		new LapDetailBuilder().build()
	];

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ ResultProgressionComponent ]
		})
		.compileComponents();

		fixture = TestBed.createComponent(ResultProgressionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should generate chart when modal shown', () => {
		component.lapDetails = lapDetailsStub;
		component.resultDetailModalShown = true;

		fixture.detectChanges();

		expect(component.resultProgressionChart).toBeTruthy();
	});

	it('should return structured array of lap details', () => {
		let result = component.formatLapDetails(lapDetailsStub);

		expect(result.length).toBe(3);
		expect(result[0]).toEqual({ x: 0, y: 0 });
		expect(result[2]).toEqual({ x: 1100, y: 5 });
	});

});
