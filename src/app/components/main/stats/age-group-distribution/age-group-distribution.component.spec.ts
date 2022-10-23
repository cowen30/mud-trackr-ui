import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgeGroupDistributionComponent } from './age-group-distribution.component';

describe('AgeGroupDistributionComponent', () => {
  let component: AgeGroupDistributionComponent;
  let fixture: ComponentFixture<AgeGroupDistributionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgeGroupDistributionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgeGroupDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
