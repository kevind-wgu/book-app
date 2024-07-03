import { Component, Input } from '@angular/core';
import { SeriesReview } from '../../models';
import { RateViewComponent } from '../rate-view/rate-view.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-review-view',
  standalone: true,
  imports: [CommonModule, RateViewComponent],
  templateUrl: './review-view.component.html',
  styleUrl: './review-view.component.css'
})
export class SeriesReviewViewComponent {
  @Input() review!: SeriesReview;
  @Input() small: boolean = true;

  constructor() {}
}