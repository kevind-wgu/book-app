import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SearchComponent } from './search/search/search.component';
import { authGuard } from './auth/auth.guard';
import { AddSeriesComponent } from './series/add-series/add-series.component';

export const routes: Routes = [
  {path: '', redirectTo: '/search', pathMatch: 'full'},
  {path: 'search', component: SearchComponent, canActivate: [authGuard]},
  {path: 'series/new', component: AddSeriesComponent, canActivate: [authGuard]},
  {path: 'login', component: LoginComponent},
];
