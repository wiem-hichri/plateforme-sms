import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RmContactListDialogComponent } from './rm-contact-list-dialog.component';

describe('RmContactListDialogComponent', () => {
  let component: RmContactListDialogComponent;
  let fixture: ComponentFixture<RmContactListDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RmContactListDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RmContactListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
