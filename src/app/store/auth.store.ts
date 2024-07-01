import { createAction, createReducer, on, props } from "@ngrx/store";
import { AuthData, authFromStorageString } from "../models";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { DatastoreService } from "../datastore.service";
import { of, switchMap, tap } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { Router } from "@angular/router";

export interface State {
  auth: AuthData | null,
}

const INITIAL_STATE : State = {
  auth: null,
};

export const login = createAction('[Auth] Login', props<{auth: AuthData, fromLocal: boolean}>());
export const autoLogin = createAction('[Auth] AutoLogin');


export const authReducer = createReducer(
  INITIAL_STATE,
  on(login, (state, action) => {
    return {...state, auth: action.auth};
  }),
);


@Injectable(
)
export class AuthEffects {
  constructor(
    private actions$: Actions, 
    private authService: AuthService,
    private router: Router,
  ) {}

  autoLogin = createEffect(
    () => this.actions$.pipe(
      ofType(autoLogin),
      switchMap(() => {
        console.log("Auto Login A")
        const localAuthStr = localStorage.getItem('auth');
        if (localAuthStr) {
          console.log("Auto Login B")
          const auth = authFromStorageString(localAuthStr);

          if (auth && auth.isValid()) {
            console.log("Auto Login C")
            return of(login({auth: auth, fromLocal: true}));
          }
          else if (auth && auth.getRefreshToken()) {
            console.log("Auto Login D")
            this.authService.refresh(auth);
            return of();
          }
        }
        console.log("Auto Login E")
        return of();
      }),
    ),
  );

  storeLogin = createEffect(
    () => this.actions$.pipe(
      ofType(login),
      tap((action) => {
        if (!action.fromLocal && action.auth?.isValid()) {
          console.log("store Local Auth", action.auth);
          localStorage.setItem('auth', action.auth.toStorageString());
        }
      })
    ),
    {dispatch: false}
  );

  loginRedirect= createEffect(
    () => this.actions$.pipe(
      ofType(login),
      tap((action) => {
        this.router.navigate(["search"]);
      })
    ),
    {dispatch: false}
  );
}
