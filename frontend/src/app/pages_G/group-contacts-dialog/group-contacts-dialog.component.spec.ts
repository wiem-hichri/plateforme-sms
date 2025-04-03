import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupContactsDialogComponent } from './group-contacts-dialog.component';

describe('GroupContactsDialogComponent', () => {
  let component: GroupContactsDialogComponent;
  let fixture: ComponentFixture<GroupContactsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupContactsDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupContactsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
