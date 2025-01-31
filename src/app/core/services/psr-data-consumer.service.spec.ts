import { TestBed } from '@angular/core/testing';

import { PsrDataConsumerService } from './psr-data-consumer.service';

describe('PsrDataConsumerService', () => {
  let service: PsrDataConsumerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PsrDataConsumerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
