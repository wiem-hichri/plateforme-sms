import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSmsModelDialogComponent } from './edit-sms-model-dialog.component';

describe('EditSmsModelDialogComponent', () => {
  let component: EditSmsModelDialogComponent;
  let fixture: ComponentFixture<EditSmsModelDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSmsModelDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditSmsModelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
