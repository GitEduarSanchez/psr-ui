import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliIaComponent } from './poli-ia.component';

describe('PoliIaComponent', () => {
  let component: PoliIaComponent;
  let fixture: ComponentFixture<PoliIaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoliIaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PoliIaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
