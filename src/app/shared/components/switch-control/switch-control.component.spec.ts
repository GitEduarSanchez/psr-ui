import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchControlComponent } from './switch-control.component';

describe('SwitchControlComponent', () => {
  let component: SwitchControlComponent;
  let fixture: ComponentFixture<SwitchControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwitchControlComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SwitchControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
