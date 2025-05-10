import { TestBed } from '@angular/core/testing';

import { SmsModalService } from './sms-modal.service';

describe('SmsModalService', () => {
  let service: SmsModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SmsModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
