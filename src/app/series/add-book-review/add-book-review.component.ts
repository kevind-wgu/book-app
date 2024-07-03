import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { DatastoreService } from '../../datastore.service';
import { AppState } from '../../store/app.store';
import { Book, BookReview } from '../../shared/models.objects';
import { RatingList } from '../../shared/models.types';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { RateViewComponent } from '../../shared/rate-view/rate-view.component';
import { setBookReview } from '../../store/series.store';

@Component({
  selector: 'app-add-book-review',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RateViewComponent],
  templateUrl: './add-book-review.component.html',
  styleUrl: './add-book-review.component.css'
})
export class AddBookReviewComponent {
  @Input({required: true}) onCloseListener!: Subject<boolean>;
  @Input({required: true}) seriesId!: string;
  @Input({required: true}) book!: Book;

  private subs: Subscription[] = [];
  form!: FormGroup;
  ratingControl = [
    {type: 'overall', title: "Overall Rating", data: RatingList},
  ];

  collapseRating : {[key: string]: boolean} = {};

  constructor(
    private datastore: DatastoreService, 
    private store: Store<AppState>, 
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    const review = this.getBookReview();
    console.log("Set SeriesReview", review);
    const formRatings: {[key: string]: FormControl} = {
      overall: new FormControl(review ? review.overall : '', [Validators.required]),
    };

    this.form = new FormGroup({
      ...formRatings,
    });

    Object.keys(formRatings).forEach(k => {
      this.subs.push(formRatings[k].valueChanges.subscribe(v => {
        if (v) {
          this.collapseRating[k] = true;
        }
      }));
    });
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  onToggleShowRating(name: string) {
    if (this.form.controls[name].valid) {
      this.collapseRating[name] = !this.collapseRating[name];
    }
  }

  private getBookReview() : BookReview | null {
    var review = null;
    if (this.book?.reviews) {
      review = this.book.reviews[this.authService.getAuth().getId()];
    }
    return review;
  }

  onSubmit() {
    if (this.form.valid) {
      const formData = this.form.value;
      const userId = this.authService.getAuth().getId();
      const userName = this.authService.getAuth().getId();

      const bookId = this.book.id;
      const review : BookReview = {
        userId: userId,
        date: new Date(), 
        overall: formData.overall, 
      }
      const prevSeriesReview = this.getBookReview();
      if (prevSeriesReview) {
        review.date = prevSeriesReview.date;
      }

      console.log("save Book review", bookId, review);
      this.datastore.upsertBookReview(this.seriesId, bookId, userId, review).subscribe(res => {
        this.store.dispatch(setBookReview({seriesId: this.seriesId, bookId: bookId, review: review}));
        this.onCloseListener.next(true);
      });
    }
  }

  onCancel() {
    this.onCloseListener.next(false);
  }
}
