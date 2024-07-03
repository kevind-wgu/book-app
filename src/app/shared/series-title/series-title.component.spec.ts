import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeriesTitleComponent } from './series-title.component';

describe('SeriesTitleComponent', () => {
  let component: SeriesTitleComponent;
  let fixture: ComponentFixture<SeriesTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeriesTitleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SeriesTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
