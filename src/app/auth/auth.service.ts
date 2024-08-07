import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { ErrortrackerService } from '../errors/errortracker.service';
import { AuthData } from '../shared/models.objects';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.store';
import * as AuthStore from '../store/auth.store';

const URL = environment.googleApiUrl;
const API_KEY = environment.firebaseAPIKey;

interface AuthResponse {
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered: boolean,
};

interface AuthRefreshResponse {
  expires_in: string,
  token_type: string,
  refresh_token: string,
  id_token: string,
  user_id: string,
  project_id: string,
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: AuthData | null = null;

  constructor(private client: HttpClient, private errortracker: ErrortrackerService, private store: Store<AppState>) { 
    store.select('auth').subscribe(store => {
      this.auth = store.auth;
    })
  }

  getAuth(): AuthData {
    if (this.auth == null) {
      throw new Error("Auth Missing");
    }
    return this.auth;
  }

  login(email: string, password: string) : Observable<AuthData> {
    // console.log("LOGIN:");
    return this.client.post<AuthResponse>(
      `${URL}/v1/accounts:signInWithPassword?key=${API_KEY}`, 
      {email: email, password: password, returnSecureToken: true,}
    )
    .pipe(
      catchError((e, caught) => {
        this.errortracker.addError("Error Authenticating", e, {email: email, caught:caught});
        return throwError(() => caught);
      }),
      map(res => {
        const expireDate = new Date();
        expireDate.setSeconds(expireDate.getSeconds() + (+res.expiresIn));
        const auth = new AuthData(res.localId, res.email, res.idToken, expireDate, res.refreshToken);
        // console.log("LOGIN SUCCESS:", auth.isValid(), auth);
        this.store.dispatch(AuthStore.login({auth: auth, fromLocal: false}));
        return auth;
      })
    );
  }

  refresh(auth: AuthData) : Observable<AuthData> {
    console.log("REFRESH Auth:");
    return this.client.post<AuthRefreshResponse>(
      `${URL}/v1/token?key=${API_KEY}`, 
      {grant_type: 'refresh_token', refresh_token: auth.getRefreshToken()}
    )
    .pipe(
      catchError((e, caught) => {
        this.errortracker.addError("Error Refreshing Authentication", e, {caught:caught});
        return throwError(() => caught);
      }),
      map(res => {
        console.log("REFRESH Auth Success:");
        const expireDate = new Date();
        expireDate.setSeconds(expireDate.getSeconds() + (+res.expires_in));
        const refreshAuth = new AuthData(auth.getId(), auth.getEmail(), res.id_token, expireDate, res.refresh_token);
        // console.log("REFRESH SUCCESS:", refreshAuth);
        this.store.dispatch(AuthStore.login({auth: refreshAuth, fromLocal: false}));
        return auth;
      })
    );
  }
}
