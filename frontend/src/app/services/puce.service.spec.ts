import { TestBed } from '@angular/core/testing';

import { PuceService } from './puce.service';

describe('PuceService', () => {
  let service: PuceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PuceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
