import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseSmsMethodComponent } from './choose-sms-method.component';

describe('ChooseSmsMethodComponent', () => {
  let component: ChooseSmsMethodComponent;
  let fixture: ComponentFixture<ChooseSmsMethodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChooseSmsMethodComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChooseSmsMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
