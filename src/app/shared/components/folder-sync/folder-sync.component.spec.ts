import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderSyncComponent } from './folder-sync.component';

describe('FolderSyncComponent', () => {
  let component: FolderSyncComponent;
  let fixture: ComponentFixture<FolderSyncComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FolderSyncComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FolderSyncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
