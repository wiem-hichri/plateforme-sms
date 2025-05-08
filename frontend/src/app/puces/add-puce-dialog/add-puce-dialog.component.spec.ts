import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPuceDialogComponent } from './add-puce-dialog.component';

describe('AddPuceDialogComponent', () => {
  let component: AddPuceDialogComponent;
  let fixture: ComponentFixture<AddPuceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPuceDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddPuceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
