import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { RatingType, RatingDetail, RatingData, ViolenceType, ProfanityType, SexType, ViolenceData, ProfanityData, SexData } from '../../models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rate-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rate-view.component.html',
  styleUrl: './rate-view.component.css'
})
export class RateViewComponent implements OnChanges {
  @Input({required: true}) type!: RatingType | ViolenceType | ProfanityType | SexType | string;
  @Input() small: boolean = false;
  @Input() medium: boolean = false;
  @Input() large: boolean = false;
  data!: RatingDetail;

  ngOnChanges(changes: SimpleChanges): void {
    this.setData();
  }

  private setData() {
    if (this.type in RatingData) {
      this.data = RatingData[this.type as RatingType];
    }
    else if (this.type in ViolenceType) {
      this.data = ViolenceData[this.type as ViolenceType];
    }
    else if (this.type in ProfanityType) {
      this.data = ProfanityData[this.type as ProfanityType];
    }
    else if (this.type in SexType) {
      this.data = SexData[this.type as SexType];
    }
  }


}
