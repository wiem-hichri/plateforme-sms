import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuceComponent } from './puce.component';

describe('PuceComponent', () => {
  let component: PuceComponent;
  let fixture: ComponentFixture<PuceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PuceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PuceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
