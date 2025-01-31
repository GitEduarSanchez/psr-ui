import { TestBed } from '@angular/core/testing';

import { DeviceOperationService } from './device-operation.service';

describe('DeviceOperationService', () => {
  let service: DeviceOperationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeviceOperationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
