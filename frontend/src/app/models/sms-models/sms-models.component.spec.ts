import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsModelsComponent } from './sms-models.component';

describe('SmsModelsComponent', () => {
  let component: SmsModelsComponent;
  let fixture: ComponentFixture<SmsModelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmsModelsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SmsModelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
