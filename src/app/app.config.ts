import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AuthInterceptor } from './auth/auth.interceptor';
import { AuthGuardClass } from './auth/auth.guard';
import { appReducer } from './store/app.store';
import { AuthEffects } from './store/auth.store';
import { SeriesEffects } from './store/series.store';
import { UserdataEffects } from './store/userdata.store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideStore(appReducer), 
    provideEffects([AuthEffects, SeriesEffects, UserdataEffects]),
    provideHttpClient(
      withInterceptorsFromDi(),
      withInterceptors([]),
    ),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AuthGuardClass,
    provideAnimations(),
  ]
};
