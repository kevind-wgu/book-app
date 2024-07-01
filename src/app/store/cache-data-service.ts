import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './app.store';
import { Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CacheDataService implements OnDestroy {
  refreshEvent = new Subject<boolean>();

  private subs: Subscription[] = [];

  constructor(private store: Store<AppState>) { 
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }
}
