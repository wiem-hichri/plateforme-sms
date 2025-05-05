import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMissionDialogComponent } from './edit-mission-dialog.component';

describe('EditMissionDialogComponent', () => {
  let component: EditMissionDialogComponent;
  let fixture: ComponentFixture<EditMissionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditMissionDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditMissionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
