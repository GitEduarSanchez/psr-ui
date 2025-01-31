import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarChartGraphComponent } from './bar-chart-graph.component';

describe('BarChartGraphicComponent', () => {
  let component: BarChartGraphComponent;
  let fixture: ComponentFixture<BarChartGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarChartGraphComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BarChartGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
