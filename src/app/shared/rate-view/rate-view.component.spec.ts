import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateViewComponent } from './rate-view.component';

describe('RateViewComponent', () => {
  let component: RateViewComponent;
  let fixture: ComponentFixture<RateViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RateViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RateViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
