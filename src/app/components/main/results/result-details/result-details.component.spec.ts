import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import createSpyObj = jasmine.createSpyObj;
import SpyObj = jasmine.SpyObj;

import { ResultDetailsComponent } from './result-details.component';
import ResultBuilder from 'src/app/helpers/builders/result.builder';

describe('ResultDetailsComponent', () => {
	let component: ResultDetailsComponent;
	let fixture: ComponentFixture<ResultDetailsComponent>;

	// let mockActiveModal: SpyObj<NgbActiveModal>;

	beforeEach(async () => {
		// mockActiveModal = createSpyObj('NgbActiveModal', ['dismiss', 'close']);

		await TestBed.configureTestingModule({
			declarations: [
				ResultDetailsComponent
			],
			providers: [
				NgbActiveModal
			]
		})
		.compileComponents();

		fixture = TestBed.createComponent(ResultDetailsComponent);
		component = fixture.componentInstance;
		component.result = ResultBuilder.buildResult();
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
