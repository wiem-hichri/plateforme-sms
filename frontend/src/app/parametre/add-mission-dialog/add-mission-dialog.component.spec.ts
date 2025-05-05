import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMissionDialogComponent } from './add-mission-dialog.component';

describe('AddMissionDialogComponent', () => {
  let component: AddMissionDialogComponent;
  let fixture: ComponentFixture<AddMissionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMissionDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddMissionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
