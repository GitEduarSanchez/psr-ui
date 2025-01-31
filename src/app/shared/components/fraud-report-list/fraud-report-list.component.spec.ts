import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FraudReportListComponent } from './fraud-report-list.component';

describe('FraudReportListComponent', () => {
  let component: FraudReportListComponent;
  let fixture: ComponentFixture<FraudReportListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FraudReportListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FraudReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
