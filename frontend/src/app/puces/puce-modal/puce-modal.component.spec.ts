import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuceModalComponent } from './puce-modal.component';

describe('PuceModalComponent', () => {
  let component: PuceModalComponent;
  let fixture: ComponentFixture<PuceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PuceModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PuceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
