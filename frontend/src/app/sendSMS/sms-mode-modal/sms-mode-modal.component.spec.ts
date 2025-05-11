import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsModeModalComponent } from './sms-mode-modal.component';

describe('SmsModeModalComponent', () => {
  let component: SmsModeModalComponent;
  let fixture: ComponentFixture<SmsModeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmsModeModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SmsModeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
