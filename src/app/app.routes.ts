import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SearchComponent } from './search/search/search.component';
import { authGuard } from './auth/auth.guard';
import { AddSeriesComponent } from './series/add-series/add-series.component';
import { ViewSeriesComponent } from './series/view-series/view-series.component';
import { AddSeriesReviewComponent } from './series/add-series-review/add-series-review.component';

export const routes: Routes = [
  {path: '', redirectTo: '/search', pathMatch: 'full'},
  {path: 'search', component: SearchComponent, canActivate: [authGuard]},
  {path: 'series', canActivate: [authGuard], children: [
    {path: 'new', component: AddSeriesComponent},
    {path: ':id', component: ViewSeriesComponent},
    {path: ':id/edit', component: AddSeriesComponent},
    {path: ':id/review', component: AddSeriesReviewComponent},
  ]},
  {path: 'login', component: LoginComponent},
];
