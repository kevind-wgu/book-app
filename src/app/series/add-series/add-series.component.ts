import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import { AppState } from '../../store/app.store';
import { DatastoreService } from '../../datastore.service';
import { Series, GenreData } from '../../models';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subscription, debounceTime, switchMap } from 'rxjs';
import { setSeries } from '../../store/series.store';
import { ErrortrackerService } from '../../errors/errortracker.service';

var URL_REGEXP = /^[A-Za-z][A-Za-z\d.+-]*:\/*(?:\w+(?::\w+)?@)?[^\s/]+(?::\d+)?(?:\/[\w#!:.?+=&%@\-/]*)?$/;

@Component({
  selector: 'app-add-series',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-series.component.html',
  styleUrl: './add-series.component.css'
})
export class AddSeriesComponent implements OnInit, OnDestroy {
  private subs : Subscription[] = [];
  private seriesId: string | null = null;
  private editInitted = false;
  private series: Series[] = [];

  form!: FormGroup;
  edit = false;
  genreTypes = GenreData;
  sanitizedReviewUrl: SafeResourceUrl | null = null;

  constructor(
    private errorTracker: ErrortrackerService,
    private datastore: DatastoreService, 
    private store: Store<AppState>, 
    private router: Router, 
    private sanitizer:DomSanitizer,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {

    this.subs.push(this.route.params.pipe(
      switchMap(params => {
        if (params['id']) {
          this.seriesId = params['id'];
        }
        return this.store.select('series');
    }))
    .subscribe(store => {
      if (this.seriesId) {
        this.initForm(store.seriesSet[this.seriesId]);
      }
      else {
        this.initForm(null);
      }
    }));
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  initForm(series: Series | null) {
    if (!this.editInitted && (!this.seriesId || series)) {
      this.editInitted = true;
      this.edit = !!this.series;

      const reviewUrl = new FormControl(series?.reviewUrl, [Validators.pattern(URL_REGEXP)]);
      this.form = new FormGroup({
        author: new FormControl(series?.author, [Validators.required]),
        genre: new FormControl(series?.genre, [Validators.required]),
        title: new FormControl(series?.title, [Validators.required]),
        imageUrl: new FormControl(series?.imageUrl, [Validators.required, Validators.pattern(URL_REGEXP)]),
        goodreadsId: new FormControl(series?.goodreadsId, []),
        synopsis: new FormControl(series?.synopsis, [Validators.required]),
        complete: new FormControl(series?.complete, []), 
        reviewUrl: reviewUrl,
      });

      this.subs.push(reviewUrl.valueChanges.pipe(debounceTime(500)).subscribe(value => {
        console.log("reviewUrl changed");
        if (value) {
          this.sanitizedReviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(value);
        }
        else {
          this.sanitizedReviewUrl = null;
        }
      }));
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const formData = this.form.value;
      if (this.series.find(s => s.title.toUpperCase() === formData.title.toUpperCase())) {
        this.errorTracker.addError('Series with this name already exists');
        return;
      }

      var seriesId = this.edit ? this.seriesId : crypto.randomUUID();
      if (seriesId) {
        const series : Series = {
          id: seriesId,
          author: formData.author,
          genre: formData.genre,
          reviewUrl: formData.reviewUrl,
          title: formData.title,
          imageUrl: formData.imageUrl,
          goodreadsId: formData.goodreadsId,
          synopsis: formData.synopsis,
          complete: !!formData.complete,
        }
        console.log("save series", series);
        this.datastore.updateSeries(series).subscribe(res => {
          this.store.dispatch(setSeries({series: series}));
          this.router.navigate(['series',seriesId]);
        });
      }
    }
  }

  onCancel() {
    if (this.edit && this.seriesId) {
      this.router.navigate(['series', this.seriesId])
    }
    else {
      this.router.navigate(['search'])
    }
  }


}
