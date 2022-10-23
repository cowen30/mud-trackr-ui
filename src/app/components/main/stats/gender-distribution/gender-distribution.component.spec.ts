import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenderDistributionComponent } from './gender-distribution.component';

describe('GenderDistributionComponent', () => {
  let component: GenderDistributionComponent;
  let fixture: ComponentFixture<GenderDistributionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenderDistributionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenderDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
