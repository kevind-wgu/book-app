import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBookReviewComponent } from './add-book-review.component';

describe('AddBookReviewComponent', () => {
  let component: AddBookReviewComponent;
  let fixture: ComponentFixture<AddBookReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBookReviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddBookReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
