import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.store';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ErrortrackerService } from '../errors/errortracker.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SearchDataService } from '../search/search-data.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  animations: [
    trigger('errorAnimation', [
      state(
        'fadeInFlash',
        style({ opacity: 1.0 })
      ),
      transition('void => *', [
        style({ opacity: 0.0 }),
        animate(
          '500ms',
          style({ opacity: 1.1 })
        ),
      ]),
      transition('* => void', [
        style({ opacity: 1.1 }),
        animate(
          '500ms',
          style({ opacity: 0.0 })
        ),
      ]),
    ]),
  ],
})
export class HeaderComponent implements OnInit, OnDestroy {
  subs: Subscription[] = [];
  errors: string[] = [];
  errorCount = 0;

  constructor(
    public searchDataService: SearchDataService,
    private errorTracker: ErrortrackerService,
    private router: Router,
  ){}

  ngOnInit(): void {
    this.subs.push(this.errorTracker.errorsChanged.subscribe(errors => {
      this.errors = errors;
    }));
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }
}
