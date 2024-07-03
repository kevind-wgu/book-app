import { Store, createAction, createReducer, on, props } from "@ngrx/store";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, of, switchMap, tap, withLatestFrom } from "rxjs";

import { DatastoreService } from "../datastore.service";
import * as AuthStore from "./auth.store";
import { AppState } from "./app.store";
import { Router } from "@angular/router";
import { Review, Series } from "../models";
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

export const setReview = createAction('[Series] setReview', 
  props<{seriesId: string, review: Review}>()
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
  on(setReview, (state, action) => {
    var seriesList = [...state.seriesList];
    var seriesSet = keyById(seriesList);
    const series = {...seriesSet[action.seriesId]};
    if (series) {
      series.reviews = {...series.reviews, [action.review.userId]: action.review};
    }

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