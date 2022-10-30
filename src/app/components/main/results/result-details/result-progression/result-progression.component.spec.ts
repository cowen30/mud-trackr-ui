import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultProgressionComponent } from './result-progression.component';

describe('ResultProgressionComponent', () => {
  let component: ResultProgressionComponent;
  let fixture: ComponentFixture<ResultProgressionComponent>;

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
});
