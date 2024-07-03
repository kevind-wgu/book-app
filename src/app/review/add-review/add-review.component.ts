import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription, switchMap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Store } from '@ngrx/store';

import { DatastoreService } from '../../datastore.service';
import { AppState } from '../../store/app.store';
import { SeriesReview, Series } from '../../shared/models.objects';
import { RatingList, ViolenceList, ProfanityList, SexList } from '../../shared/models.types';
import { AuthService } from '../../auth/auth.service';
import { setSeriesReview } from '../../store/series.store';
import { CommonModule } from '@angular/common';
import { RateViewComponent } from '../../shared/rate-view/rate-view.component';

@Component({
  selector: 'app-add-review',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RateViewComponent],
  templateUrl: './add-review.component.html',
  styleUrl: './add-review.component.css'
})
export class AddSeriesReviewComponent {
  private subs : Subscription[] = [];
  private editInitted = false;
  private seriesId!: string;
  private fromSearch: boolean = false;
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
    // this.subs.push(
      this.route.params.pipe(
        switchMap(params => {
          if (params['id']) {
            this.seriesId = params['id'];
          }
          return this.route.queryParams.pipe(
            switchMap(queryParams => {
              if (queryParams['fromSearch']) {
                this.fromSearch = true;
              }
              return this.store.select('series');
            })
          );
        },
      )).subscribe(store => {
        this.series = store.seriesSet[this.seriesId];
        this.setupForm();
      });
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  private setupForm() {
    if (!this.editInitted) {
      this.editInitted = true;
      const review = this.getSeriesReview();
      console.log("Set SeriesReview", review);
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
      });
    }
  }

  onToggleShowRating(name: string) {
    if (this.form.controls[name].valid) {
      this.collapseRating[name] = !this.collapseRating[name];
    }
  }

  private getSeriesReview() : SeriesReview | null {
    var review = null;
    if (this.series?.reviews) {
      review = this.series.reviews[this.authService.getAuth().getId()];
    }
    return review;
  }

  onSubmit() {
    if (this.form.valid) {
      const formData = this.form.value;
      const userId = this.authService.getAuth().getId();
      const seriesId = this.series.id;
      const review : SeriesReview = {
        userId: userId,
        notes: formData.notes,
        date: new Date(), 
        overall: formData.overall, 
        violence: formData.violence,
        sex: formData.sex, 
        profanity: formData.profanity,
      }
      const prevSeriesReview = this.getSeriesReview();
      if (prevSeriesReview) {
        review.date = prevSeriesReview.date;
      }

      console.log("save review", seriesId, review);
      this.datastore.upsertSeriesReview(seriesId, userId, review).subscribe(res => {
        this.store.dispatch(setSeriesReview({seriesId: seriesId, review: review}));
        this.navigate();
      });
    }
  }

  onCancel() {
    if (this.series) {
      this.navigate();
    }
  }

  private navigate() {
    if (this.fromSearch) {
      this.router.navigate(['search'])
    }
    else {
      this.router.navigate(['series', this.series.id])
    }
  }
}
