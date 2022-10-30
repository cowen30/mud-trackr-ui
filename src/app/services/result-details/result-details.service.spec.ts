import { TestBed } from '@angular/core/testing';

import { ResultDetailsService } from './result-details.service';

describe('ResultDetailsService', () => {
  let service: ResultDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResultDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
