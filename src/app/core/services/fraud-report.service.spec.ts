import { TestBed } from '@angular/core/testing';

import { FraudReportService } from './fraud-report.service';

describe('FraudReportService', () => {
  let service: FraudReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FraudReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
