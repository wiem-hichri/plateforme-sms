import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametreBoardComponent } from './parametre-board.component';

describe('ParametreBoardComponent', () => {
  let component: ParametreBoardComponent;
  let fixture: ComponentFixture<ParametreBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParametreBoardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParametreBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
