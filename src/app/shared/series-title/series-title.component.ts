import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

import { BookmarkComponent } from '../bookmark/bookmark.component';
import { RateViewComponent } from '../rate-view/rate-view.component';
import { SeriesReviewViewComponent } from '../review-view/review-view.component';
import { Series, SeriesReview } from '../models.objects';
import { RatingType } from '../models.types';
import { UsercacheService } from '../../cache/usercache.service';

@Component({
  selector: 'app-series-title',
  standalone: true,
  imports: [CommonModule, BookmarkComponent, RateViewComponent, SeriesReviewViewComponent],
  templateUrl: './series-title.component.html',
  styleUrl: './series-title.component.css'
})
export class SeriesTitleComponent implements OnInit {
  @Input() series!: Series;
  @Input() bookmarked: boolean = false;
  review: SeriesReview | null = null;
  rateType :RatingType | null = null;

  constructor(private cache: UsercacheService) {

  }

  ngOnInit(): void {
    if (this.series.reviews) {
      this.review = this.series.reviews[this.cache.getPrimaryReviewerId()];
      this.rateType = this.review.overall;
    }
  }
}
