import { Store, createAction, createReducer, on, props } from "@ngrx/store";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, of, switchMap, tap, withLatestFrom } from "rxjs";

import { DatastoreService, UserData } from "../datastore.service";
import * as AuthStore from "./auth.store";
import { AppState } from "./app.store";
import { Bookmarks } from "../shared/models.objects";

export interface State {
  bookmarks: Bookmarks,
}

const INITIAL_STATE : State = {
  bookmarks: {},
};

export const setUserData = createAction('[UserData] Set All UserData', 
  props<{userData: UserData}>()
);

export const reloadUserData = createAction('[UserData] Reload UserData');

export const UserDataReducer = createReducer(
  INITIAL_STATE,
  on(setUserData, (state, action) => {
    // console.log("Set User Data", action);
    return {...state, bookmarks: {...action.userData.bookmarks}};
  }),
);

@Injectable(
)
export class UserdataEffects {
  constructor(
    private actions$: Actions, 
    private datastore: DatastoreService,
    private store: Store<AppState>,
  ) {}

  loadUserDataOnLogin = createEffect(
    () => this.actions$.pipe(
      ofType(AuthStore.login, reloadUserData),
      withLatestFrom(this.store.select('auth')),
      switchMap(([action, store]) => {
        // console.log("Load Series Effect: Firebase");
        if (store.auth) {
          return this.datastore.getUserData(store.auth.getId());
        }
        return of();
      }),
      map((userData) => {
        return setUserData({userData: userData});
      }),
    )
  );
}