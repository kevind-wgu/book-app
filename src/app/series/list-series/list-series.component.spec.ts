import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSeriesComponent } from './list-series.component';

describe('ListSeriesComponent', () => {
  let component: ListSeriesComponent;
  let fixture: ComponentFixture<ListSeriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListSeriesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListSeriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
