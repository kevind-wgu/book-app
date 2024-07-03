import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import * as UserStore from '../store/userdata.store'
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.store';
import { Bookmarks, Series, SeriesSet } from '../models';

export enum ChangeType {
  bookmarks,
  primaryReviewer,
  series,
}

@Injectable({
  providedIn: 'root'
})
export class UsercacheService {
  changed = new Subject<ChangeType>();

  private primaryReviewerId: string = '3UVNbZd0KQgvovp0q4GuVxWwPQp2';
  private bookmarks: Bookmarks = {};
  private seriesList: Series[] = [];
  private seriesSet: SeriesSet = {};

  constructor(private store: Store<AppState>) { 
    store.select('userdata').subscribe(store => {
      this.bookmarks = store.bookmarks;
      this.changed.next(ChangeType.bookmarks)
    });
    store.select('series').subscribe(store => {
      this.seriesList = store.seriesList;
      this.seriesSet= store.seriesSet;
      this.changed.next(ChangeType.bookmarks)
    });
  }

  getPrimaryReviewerId() : string {
    return this.primaryReviewerId;
  }

  getBookmarks() : Bookmarks {
    return {...this.bookmarks};
  }

  getSeriesList() : Series[] {
    return [...this.seriesList];
  }

  getSeriesSet() : SeriesSet {
    return {...this.seriesSet};
  }
}
