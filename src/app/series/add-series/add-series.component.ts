import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import { AppState } from '../../store/app.store';
import { DatastoreService } from '../../datastore.service';
import { Series, GenreData } from '../../models';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subscription, debounceTime } from 'rxjs';
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
  private seriesId?: string;
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
  ) {}

  ngOnInit(): void {
    const reviewUrl = new FormControl('', [Validators.pattern(URL_REGEXP)]);
    this.form = new FormGroup({
      author: new FormControl('', [Validators.required]),
      genre: new FormControl('', [Validators.required]),
      title: new FormControl('', [Validators.required]),
      imageUrl: new FormControl('', [Validators.required, Validators.pattern(URL_REGEXP)]),
      goodreadsId: new FormControl('', []),
      synopsis: new FormControl('', [Validators.required]),
      complete: new FormControl('', []), 
      reviewUrl: reviewUrl,
    });

    this.subs.push(this.store.select('series').subscribe(seriesStore => {
      this.series = seriesStore.seriesList;
    }));

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

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
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
