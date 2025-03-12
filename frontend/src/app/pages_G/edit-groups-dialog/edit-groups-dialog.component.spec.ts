import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGroupsDialogComponent } from './edit-groups-dialog.component';

describe('EditGroupsDialogComponent', () => {
  let component: EditGroupsDialogComponent;
  let fixture: ComponentFixture<EditGroupsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditGroupsDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditGroupsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
