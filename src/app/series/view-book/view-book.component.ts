import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';

import { Book, BookReview } from '../../shared/models.objects';
import { LocationType, RatingList } from '../../shared/models.types';
import { AddBookComponent } from '../add-book/add-book.component';
import { Subject } from 'rxjs';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AddBookReviewComponent } from '../add-book-review/add-book-review.component';
import { AuthService } from '../../auth/auth.service';
import { RateViewComponent } from '../../shared/rate-view/rate-view.component';

@Component({
  selector: 'app-view-book',
  standalone: true,
  imports: [CommonModule, AddBookComponent, ReactiveFormsModule, AddBookReviewComponent, RateViewComponent],
  templateUrl: './view-book.component.html',
  styleUrl: './view-book.component.css'
})
export class ViewBookComponent implements OnInit {
  @Input({required: true}) seriesId!: string;
  @Input({required: true}) book!: Book;
  review?: BookReview;
  LocationType = LocationType;
  closeEditBook = new Subject<boolean>();
  edit = false;
  showTools = false;
  editReview = false;
  reviewForm!: FormGroup;

  ratingControl = [
    {type: 'overall', title: "Overall Rating", data: RatingList},
    // {type: 'violence', title: "Violence", data: ViolenceList},
    // {type: 'profanity', title: "Profanity", data: ProfanityList},
    // {type: 'sex', title: "Sex", data: SexList},
  ];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    if (this.book.reviews) {
      this.review = this.book.reviews[this.authService.getAuth().getId()];
    }
    this.closeEditBook.subscribe(_ => {
      this.resetModes();
    })
  }

  resetModes() {
    this.edit = false;
    this.showTools = false;
    this.editReview = false;
  }

  onShowTools() {
    if (this.edit || this.showTools || this.editReview) {
      this.resetModes();
    }
    else {
      this.resetModes();
      this.showTools = true;
    }
  }

  onReviewEdit() {
    this.resetModes();
    this.editReview = true;
  }

  onEdit() {
    this.resetModes();
    this.edit = true;
  }

  onReviewSave() {

  }
}
