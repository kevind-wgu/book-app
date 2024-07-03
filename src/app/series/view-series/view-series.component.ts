import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription, switchMap, tap } from 'rxjs';
import { CommonModule } from '@angular/common';

import { AppState } from '../../store/app.store';
import { ProfanityType, RatingType, SeriesReview, Series, SexType, ViolenceType } from '../../models';
import { DatastoreService } from '../../datastore.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SeriesReviewViewComponent } from '../../shared/review-view/review-view.component';
import { RateViewComponent } from '../../shared/rate-view/rate-view.component';
import { UsercacheService } from '../../cache/usercache.service';
import { BookmarkComponent } from '../../shared/bookmark/bookmark.component';

@Component({
  selector: 'app-view-series',
  standalone: true,
  imports: [CommonModule, RouterModule, SeriesReviewViewComponent, RateViewComponent, BookmarkComponent],
  templateUrl: './view-series.component.html',
  styleUrl: './view-series.component.css'
})
export class ViewSeriesComponent implements OnInit, OnDestroy {
  private subs: Subscription[] = [];
  private seriesId!: string;
  series?: Series;
  sanitizedReviewUrl: SafeResourceUrl | null = null;
  bookmarked = false;
  review: SeriesReview = {userId: '2', notes: 'Notes 1', date: new Date(), overall: RatingType.eight, violence: ViolenceType.vb, sex: SexType.g, profanity: ProfanityType.c};

  constructor(
    private cache: UsercacheService,
    private store: Store<AppState>, 
    private route: ActivatedRoute, 
    private datastore: DatastoreService,
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
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  private setData() {
    this.bookmarked = this.cache.getBookmarks()[this.seriesId];
    this.series = this.cache.getSeriesSet()[this.seriesId];
    if (this.series?.reviewUrl) {
      this.sanitizedReviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.series.reviewUrl);
    }
  }
}
