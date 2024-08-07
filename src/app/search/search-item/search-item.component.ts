import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { DatastoreService } from '../../datastore.service';
import { Series, SeriesReview } from '../../shared/models.objects';
import { ProfanityType, SexType, ViolenceType } from '../../shared/models.types';
import { SeriesTitleComponent } from '../../shared/series-title/series-title.component';
import { UsercacheService } from '../../cache/usercache.service';
import { SeriesReviewViewComponent } from '../../shared/review-view/review-view.component';

@Component({
  selector: 'app-search-item',
  standalone: true,
  imports: [CommonModule, RouterModule, SeriesTitleComponent, SeriesReviewViewComponent],
  templateUrl: './search-item.component.html',
  styleUrl: './search-item.component.css'
})
export class SearchItemComponent implements OnInit {
  @Input() series!: Series;
  @Input() bookmarked: boolean = false;
  review: SeriesReview | null = null;
  bookCount = 0;
  sexReview: SexType | null = null;
  violenceReview: ViolenceType | null = null;
  profanityReview: ProfanityType | null = null;

  constructor(private datastore: DatastoreService, private cache: UsercacheService) {}

  ngOnInit(): void {
    if (this.series.reviews) {
      this.review = this.series.reviews[this.cache.getPrimaryReviewerId()];
      this.sexReview = this.review.sex;
      this.violenceReview = this.review.violence;
      this.profanityReview = this.review.profanity;
    }
    if (this.series.books) {
      this.bookCount = Object.keys(this.series.books).length;
    }
  }
}
