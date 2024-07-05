import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { AppState } from '../../store/app.store';
import { ErrortrackerService } from '../../errors/errortracker.service';
import { DatastoreService } from '../../datastore.service';
import * as GlobalStore from '../../store/global.store';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-generes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './view-genres.component.html',
  styleUrl: './view-genres.component.css'
})
export class ViewGenresComponent implements OnInit, OnDestroy {
  private subs: Subscription[] = [];
  genres!: string[];
  form!: FormGroup;

  constructor(
    private store: Store<AppState>, 
    private errorTracker: ErrortrackerService,
    private datastore: DatastoreService,
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      'newgenre': new FormControl('', [Validators.required, ]),
    })
    this.subs.push(this.store.select('global').subscribe(store => {
      console.log("ViewGenres Global Data", store);
      this.genres = store.genres;
    }));
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  onDelete(genre: string) {
    this.datastore.deleteGenere(genre).subscribe(res => {
      this.store.dispatch(GlobalStore.reloadGlobalData())
    });
  }

  onSubmit() {
    if (this.form.valid) {
      if (this.genres.find(s => s.toUpperCase() === this.form.value.newgenre.toUpperCase())) {
        this.errorTracker.addError('Genre with this name already exists');
        return;
      }

      this.datastore.addGenere(this.form.value.newgenre).subscribe(res => {
        this.store.dispatch(GlobalStore.reloadGlobalData())
        this.form.reset({})
      });
    }
  }
}
