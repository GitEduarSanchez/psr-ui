import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignalRComponentComponent } from './signal-rcomponent.component';

describe('SignalRComponentComponent', () => {
  let component: SignalRComponentComponent;
  let fixture: ComponentFixture<SignalRComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignalRComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SignalRComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
