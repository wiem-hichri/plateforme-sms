import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGroupsDialogComponent } from './add-groups-dialog.component';

describe('AddGroupsDialogComponent', () => {
  let component: AddGroupsDialogComponent;
  let fixture: ComponentFixture<AddGroupsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddGroupsDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddGroupsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
