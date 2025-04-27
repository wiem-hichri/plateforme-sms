import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MgcSmsComponent } from './mgc-sms.component';

describe('MgcSmsComponent', () => {
  let component: MgcSmsComponent;
  let fixture: ComponentFixture<MgcSmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MgcSmsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MgcSmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
