import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { WordFilterType } from '../../shared/models.types';
import { CommonModule } from '@angular/common';
import { Subscription, debounceTime } from 'rxjs';
import { SearchDataService } from '../search-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchData } from '../../shared/models.objects';


@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.css'
})
export class SearchFormComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  WordFilterEnum= WordFilterType;
  subs: Subscription[] = [];

  constructor(private searchDataService: SearchDataService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      q: new FormControl(''),
      qt: new FormControl(WordFilterType.any),
      overall: new FormControl(''),
    });

    this.subs.push(this.route.queryParams.subscribe(params => {
      if (Object.keys(params).length == 0) {
        this.onResetSearch();
      }
      else {
        const crit : SearchData = {
          q: params['q'],
          qt: params['qt'],
          overall: params['overall'],
        }
        this.form.reset(crit);
        this.searchDataService.changeSearch(crit);
      }
    }));

    this.subs.push(this.form.valueChanges.pipe(debounceTime(500)).subscribe(change => {
      this.doSearch();
    }));
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  private doSearch() {
    const value = this.form.value;
    const search: SearchData = {
      q: !value.q? null : value.q,
      qt: value.qt,
      overall: !value.overall ? null : value.overall,
    };

    this.setQueryParams(search);
    this.searchDataService.changeSearch(search);
  }

  private setQueryParams(crit: SearchData) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: crit,
      queryParamsHandling: 'merge'
    });
  }

  onResetSearch() {
    const resetCriteria = {...this.searchDataService.EMPTY_SEARCH};
    this.form.reset(resetCriteria);
    this.searchDataService.changeSearch(resetCriteria);
    this.setQueryParams(resetCriteria)
  }

}
