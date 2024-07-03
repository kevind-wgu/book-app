import { Store, createAction, createReducer, on, props } from "@ngrx/store";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, of, switchMap, tap, withLatestFrom } from "rxjs";

import { DatastoreService } from "../datastore.service";
import * as AuthStore from "./auth.store";
import { AppState } from "./app.store";
import { Router } from "@angular/router";
import { SeriesReview, Series, Book, BookReview } from "../shared/models.objects";
import { keyById } from "../common.fn";

export interface State {
  seriesList: Series[],
  seriesSet: {[key: string]: Series},
}

const INITIAL_STATE : State = {
  seriesList: [],
  seriesSet: {},
};

export const setSeriesList = createAction('[Series] Set Series List', 
  props<{seriesList: Series[]}>()
);

export const setSeries = createAction('[Series] SetSeries', 
  props<{series: Series}>()
);

export const setSeriesReview = createAction('[Series] setSeriesReview', 
  props<{seriesId: string, review: SeriesReview}>()
);

export const setBook = createAction('[Series] setBook', 
  props<{seriesId: string, book: Book}>()
);

export const setBookReview = createAction('[Series] setBookReview', 
  props<{seriesId: string, bookId: string, review: BookReview}>()
);

export const SeriesReducer = createReducer(
  INITIAL_STATE,
  on(setSeriesList, (state, action) => {
    var seriesList = [...action.seriesList];
    var seriesSet = keyById(seriesList);
    return {...state, seriesList: seriesList, seriesSet: seriesSet};
  }),
  on(setSeries, (state, action) => {
    var seriesSet = {...state.seriesSet, [action.series.id]: action.series};
    var seriesList = Object.values(seriesSet);
    return {...state, seriesList: seriesList, seriesSet: seriesSet};
  }),
  on(setSeriesReview, (state, action) => {
    const series = {...state.seriesSet[action.seriesId]};
    series.reviews = {...series.reviews, [action.review.userId]: action.review};
    const seriesSet = {...state.seriesSet, [series.id]: series};
    const seriesList = Object.values(seriesSet);

    return {...state, seriesList: seriesList, seriesSet: seriesSet};
  }),
  on(setBookReview, (state, action) => {
    const series = {...state.seriesSet[action.seriesId]};
    if (series.books) {
      const book = {...series.books[action.bookId]};
      book.reviews = {...book.reviews, [action.review.userId]: action.review}
      series.books = {...series.books, [book.id]: book};
    }
    const seriesSet = {...state.seriesSet, [series.id]: series};
    const seriesList = Object.values(seriesSet);

    return {...state, seriesList: seriesList, seriesSet: seriesSet};
  }),
  on(setBook, (state, action) => {
    const series = {...state.seriesSet[action.seriesId]};
    series.books = {...series.books, [action.book.id]: action.book};
    const seriesSet = {...state.seriesSet, [series.id]: series};
    const seriesList = Object.values(seriesSet);

    return {...state, seriesList: seriesList, seriesSet: seriesSet};
  }),
);

@Injectable(
)
export class SeriesEffects {
  constructor(
    private actions$: Actions, 
    private datastore: DatastoreService,
    private store: Store<AppState>,
    private router: Router,
  ) {}

  loadSeriesListOnLogin = createEffect(
    () => this.actions$.pipe(
      ofType(AuthStore.login),
      switchMap(() => {
        // console.log("Load Series Effect: Firebase");
        return this.datastore.getSeriesList();
      }),
      map((seriesList) => {
        return setSeriesList({seriesList: seriesList});
      }),
    )
  );
}