import { Store, createAction, createReducer, on, props } from "@ngrx/store";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, switchMap } from "rxjs";

import { DatastoreService, GlobalData } from "../datastore.service";
import * as AuthStore from "./auth.store";

export interface State {
  genres: string[],
}

const INITIAL_STATE : State = {
  genres: [],
};

export const setGlobalData = createAction('[Global] Set Global Data', 
  props<GlobalData>()
);

export const reloadGlobalData = createAction('[Global] Reload Global Data');

export const GlobalReducer = createReducer(
  INITIAL_STATE,
  on(setGlobalData, (state, action) => {
    console.log("Set Global Data", action);
    var genres : string[] = action.genres ? Object.keys(action.genres) : [];
    return {...state, genres: genres};
  }),
);

@Injectable(
)
export class GlobalEffects {
  constructor(
    private actions$: Actions, 
    private datastore: DatastoreService,
  ) {}

  loadGlobalDataOnLogin = createEffect(
    () => this.actions$.pipe(
      ofType(AuthStore.login, reloadGlobalData),
      switchMap((action) => {
        return this.datastore.getGlobalData();
      }),
      map(data => {
        return setGlobalData(data);
      }),
    )
  );
}