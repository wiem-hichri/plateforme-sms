import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPuceDialogComponent } from './edit-puce-dialog.component';

describe('EditPuceDialogComponent', () => {
  let component: EditPuceDialogComponent;
  let fixture: ComponentFixture<EditPuceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPuceDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditPuceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
