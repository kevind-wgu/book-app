import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSeriesComponent } from './view-series.component';

describe('ViewSeriesComponent', () => {
  let component: ViewSeriesComponent;
  let fixture: ComponentFixture<ViewSeriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewSeriesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewSeriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
