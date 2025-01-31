import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriveContainerComponent } from './drive-container.component';

describe('DriveContainerComponent', () => {
  let component: DriveContainerComponent;
  let fixture: ComponentFixture<DriveContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriveContainerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DriveContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
