import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';

import createSpyObj = jasmine.createSpyObj;
import SpyObj = jasmine.SpyObj;

import { ResultBuilder } from 'src/app/builders/result.builder';
import { ResultDetailsService } from 'src/app/services/result-details/result-details.service';
import { ResultDetailsComponent } from './result-details.component';

describe('ResultDetailsComponent', () => {
	let component: ResultDetailsComponent;
	let fixture: ComponentFixture<ResultDetailsComponent>;

	let mockResultDetailsService: SpyObj<ResultDetailsService>;

	beforeEach(async () => {
		mockResultDetailsService = createSpyObj('ResultDetailsService', ['getResultDetails']);
		mockResultDetailsService.getResultDetails.and.returnValue(of());

		await TestBed.configureTestingModule({
			declarations: [
				ResultDetailsComponent
			],
			providers: [
				NgbActiveModal,
				{
					provide: ResultDetailsService,
					useValue: mockResultDetailsService
				}
			]
		})
		.compileComponents();

		fixture = TestBed.createComponent(ResultDetailsComponent);
		component = fixture.componentInstance;
		component.result = new ResultBuilder().build();
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
