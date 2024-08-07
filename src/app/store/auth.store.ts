import { createAction, createReducer, on, props } from "@ngrx/store";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, of, switchMap, tap } from "rxjs";

import { AuthData } from "../shared/models.objects";
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

  private authFromStorageString(dataStr: string) : AuthData | null {
    if (dataStr) { const data = JSON.parse(dataStr);
      if (data.email && data.token && data.expireTime && data.refreshToken) {
        const expire = new Date(data.expireTime);
        return new AuthData(data.id, data.email, data.token, expire, data.refreshToken);
      }
    }
    return null;
  }

  autoLogin = createEffect(
    () => this.actions$.pipe(
      ofType(autoLogin),
      switchMap(() => {
        const localAuthStr = localStorage.getItem('auth');
        if (localAuthStr) {
          const auth = this.authFromStorageString(localAuthStr);

          if (auth && auth.isValid()) {
            console.log("Auto Login")
            return of(auth);
          }
          else if (auth && auth.getRefreshToken()) {
            console.log("Auto Login Refresh")
            return this.authService.refresh(auth);
          }
        }
        console.log("Auto Login - No stored auth found")
        return of();
      }),
      map((data) => {
        return login({auth: data, fromLocal: true});
      })
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
        if (!action.fromLocal) {
          this.router.navigate(["search"]);
        }
      })
    ),
    {dispatch: false}
  );
}
