import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsGeneratorComponent } from './sms-generator.component';

describe('SmsGeneratorComponent', () => {
  let component: SmsGeneratorComponent;
  let fixture: ComponentFixture<SmsGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmsGeneratorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SmsGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
