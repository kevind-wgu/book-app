import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subject, Subscription, switchMap, tap } from 'rxjs';
import { CommonModule } from '@angular/common';

import { SeriesReview, Series, Book } from '../../shared/models.objects';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SeriesReviewViewComponent } from '../../shared/review-view/review-view.component';
import { RateViewComponent } from '../../shared/rate-view/rate-view.component';
import { UsercacheService } from '../../cache/usercache.service';
import { SeriesTitleComponent } from '../../shared/series-title/series-title.component';
import { AddBookComponent } from '../add-book/add-book.component';
import { ViewBookComponent } from '../view-book/view-book.component';

@Component({
  selector: 'app-view-series',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    SeriesReviewViewComponent, 
    RateViewComponent, 
    SeriesTitleComponent,
    AddBookComponent,
    ViewBookComponent,
  ],
  templateUrl: './view-series.component.html',
  styleUrl: './view-series.component.css'
})
export class ViewSeriesComponent implements OnInit, OnDestroy {
  private subs: Subscription[] = [];
  private seriesId!: string;
  series!: Series;
  books: Book[] = [];
  sanitizedReviewUrl: SafeResourceUrl | null = null;
  bookmarked = false;
  review: SeriesReview | null = null;
  closeAddBook = new Subject<boolean>();
  showAddBook = false;

  constructor(
    private cache: UsercacheService,
    private route: ActivatedRoute, 
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    this.subs.push(this.route.params.pipe(
      switchMap(params => {
        if (params['id']) {
          this.seriesId = params['id'];
        }
        this.setData();
        return this.cache.changed.pipe(
          tap(_ => this.setData())
        );
      })
    ).subscribe(() => {}));
    this.subs.push(this.closeAddBook.subscribe(signal => {
      this.showAddBook = false;
    }));
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  private setData() {
    this.bookmarked = this.cache.getBookmarks()[this.seriesId];
    this.series = this.cache.getSeriesSet()[this.seriesId];
    if (this.series?.books) {
      this.books = Object.values(this.series.books).sort((b1, b2) => b1.seriesNumber - b2.seriesNumber);
    }
    if (this.series?.reviewUrl) {
      this.sanitizedReviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.series.reviewUrl);
    }
    if (this.series?.reviews) {
      this.review = this.series.reviews[this.cache.getPrimaryReviewerId()];
    }
  }

  toggleShowAddBook() {
    this.showAddBook = !this.showAddBook;
  }

  useAccordion(value: string | null | undefined): boolean {
    if (value && value.length >= 100) {
      return true;
    }
    return false;
  }
}
