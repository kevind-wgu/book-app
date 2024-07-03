import { Component, Input } from '@angular/core';
import { SeriesReview } from '../models.objects';
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
  @Input({required: true}) review!: SeriesReview;
  @Input() small: boolean = false;
  @Input() medium: boolean = false;
  @Input() large: boolean = false;

  constructor() {}
}
