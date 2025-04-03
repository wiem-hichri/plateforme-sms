import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactListDialogComponent } from './contact-list-dialog.component';

describe('ContactListDialogComponent', () => {
  let component: ContactListDialogComponent;
  let fixture: ComponentFixture<ContactListDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactListDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContactListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
