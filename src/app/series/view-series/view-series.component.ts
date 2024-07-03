import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

import { AppState } from '../../store/app.store';
import { ProfanityType, RatingType, Review, Series, SexType, ViolenceType } from '../../models';
import { DatastoreService } from '../../datastore.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ReviewViewComponent } from '../../review/review-view/review-view.component';
import { RateViewComponent } from '../../review/rate-view/rate-view.component';

@Component({
  selector: 'app-view-series',
  standalone: true,
  imports: [CommonModule, RouterModule, ReviewViewComponent, RateViewComponent],
  templateUrl: './view-series.component.html',
  styleUrl: './view-series.component.css'
})
export class ViewSeriesComponent implements OnInit, OnDestroy {
  private subs: Subscription[] = [];
  private seriesId!: string;
  private seriesSet: {[key: string]: Series} = {};
  series?: Series;
  sanitizedReviewUrl: SafeResourceUrl | null = null;
  bookmarks: {[key: string]: boolean} = {};
  review: Review = {userId: '2', notes: 'Notes 1', date: new Date(), overall: RatingType.eight, violence: ViolenceType.vb, sex: SexType.g, profanity: ProfanityType.c};

  constructor(
    private store: Store<AppState>, 
    private route: ActivatedRoute, 
    private datastore: DatastoreService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    this.subs.push(this.route.params.subscribe(params => {
      if (params['id']) {
        this.seriesId = params['id'];
        this.setSeries();
      }
    }));
    this.subs.push(this.store.select('series').subscribe(store => {
      this.seriesSet = store.seriesSet;
      this.setSeries();
    }));
    this.subs.push(this.store.select('userdata').subscribe(store => {
      this.bookmarks= store.bookmarks;
    }));
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  private setSeries() {
    if (this.seriesId) {
      this.series = this.seriesSet[this.seriesId];
      if (this.series?.reviewUrl) {
        this.sanitizedReviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.series.reviewUrl);
      }
    }
  }

  changeBookmark(toggleOn: boolean) {
    this.datastore.toggleBookmark(this.seriesId, toggleOn);
  }
}
