import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSmsModelDialogComponent } from './add-sms-model-dialog.component';

describe('AddSmsModelDialogComponent', () => {
  let component: AddSmsModelDialogComponent;
  let fixture: ComponentFixture<AddSmsModelDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSmsModelDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddSmsModelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
