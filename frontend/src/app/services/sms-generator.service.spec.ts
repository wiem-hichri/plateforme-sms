import { TestBed } from '@angular/core/testing';

import { SmsGeneratorService } from './sms-generator.service';

describe('SmsGeneratorService', () => {
  let service: SmsGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SmsGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
