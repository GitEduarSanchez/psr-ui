import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PinConfirmationComponent } from './pin-confirmation.component';

describe('PinConfirmationComponent', () => {
  let component: PinConfirmationComponent;
  let fixture: ComponentFixture<PinConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PinConfirmationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PinConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
