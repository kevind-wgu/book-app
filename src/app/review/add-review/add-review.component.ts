import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Store } from '@ngrx/store';

import { DatastoreService } from '../../datastore.service';
import { AppState } from '../../store/app.store';
import { Review, Series, RatingData, RatingType, ViolenceData, ProfanityData, SexData, RatingList, ViolenceList, ProfanityList, SexList } from '../../models';
import { AuthService } from '../../auth/auth.service';
import { setReview } from '../../store/series.store';
import { CommonModule } from '@angular/common';
import { RateViewComponent } from '../rate-view/rate-view.component';

@Component({
  selector: 'app-add-review',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RateViewComponent],
  templateUrl: './add-review.component.html',
  styleUrl: './add-review.component.css'
})
export class AddReviewComponent {
  private subs : Subscription[] = [];
  private editInitted = false;
  private seriesId!: string;
  private seriesSet: {[key: string]: Series} = {};
  series!: Series;
  form!: FormGroup;
  edit = false;
  ratingControl = [
    {type: 'overall', title: "Overall Rating", data: RatingList},
    {type: 'violence', title: "Violence", data: ViolenceList},
    {type: 'profanity', title: "Profanity", data: ProfanityList},
    {type: 'sex', title: "Sex", data: SexList},
  ];

  collapseRating : {[key: string]: boolean} = {};

  constructor(
    private datastore: DatastoreService, 
    private store: Store<AppState>, 
    private route: ActivatedRoute,
    private router: Router, 
    private sanitizer:DomSanitizer,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.subs.push(this.route.params.subscribe(params => {
      if (params['id']) {
        this.seriesId = params['id'];
        this.setSeries();
      }
    }));
    this.subs.push(this.store.select('series').subscribe(seriesStore => {
      this.seriesSet = seriesStore.seriesSet;
      this.setSeries();
    }));
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  private setSeries() {
    if (!this.editInitted) {
      const series = this.seriesSet[this.seriesId];
      if (series) {
        this.series = series;
        this.setupForm();
      }
    }
  }

  private setupForm() {
    const review = this.getReview();
    console.log("Set Review", review);
    const formRatings: {[key: string]: FormControl} = {
      overall: new FormControl(review ? review.overall : '', [Validators.required]),
      violence: new FormControl(review ? review.violence : '', [Validators.required]),
      sex: new FormControl(review ? review.sex : '', [Validators.required]),
      profanity: new FormControl(review ? review.profanity : '', [Validators.required]),
    };

    this.form = new FormGroup({
      ...formRatings,
      notes: new FormControl(review ? review.notes : '', []),
    });

    Object.keys(formRatings).forEach(k => {
      formRatings[k].valueChanges.subscribe(v => {
        if (v) {
          this.collapseRating[k] = true;
        }
      });
    })
  }

  onToggleShowRating(name: string) {
    this.collapseRating[name] = !this.collapseRating[name];
  }

  private getReview() : Review | null {
    var review = null;
    if (this.series.reviews) {
      review = this.series.reviews[this.authService.getAuth().getId()];
    }
    return review;
  }

  onSubmit() {
    console.log("form.valid", this.form.valid, this.form.value);
    if (this.form.valid) {
      const formData = this.form.value;
      const userId = this.authService.getAuth().getId();
      const seriesId = this.series.id;
      const review : Review = {
        userId: userId,
        notes: formData.notes,
        date: new Date(), 
        overall: formData.overall, 
        violence: formData.violence,
        sex: formData.sex, 
        profanity: formData.profanity,
      }
      const prevReview = this.getReview();
      if (prevReview) {
        review.date = prevReview.date;
      }
      console.log("save review", seriesId, review);
      this.datastore.upsertReview(seriesId, userId, review).subscribe(res => {
        this.store.dispatch(setReview({seriesId: seriesId, review: review}));
        this.router.navigate(['series',seriesId]);
      });
    }
  }

  onCancel() {
    if (this.series) {
      this.router.navigate(['series', this.series.id])
    }
  }
}
