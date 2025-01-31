import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsrFormComponent } from './psr-form.component';

describe('PsrFormComponent', () => {
  let component: PsrFormComponent;
  let fixture: ComponentFixture<PsrFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PsrFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PsrFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
