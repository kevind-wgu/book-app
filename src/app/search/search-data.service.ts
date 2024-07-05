import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SearchData, Series } from '../shared/models.objects';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.store';
import { WordFilterType } from '../shared/models.types';

export enum ChangeType {
  currentPage, seriesData, search
}

@Injectable({
  providedIn: 'root'
})
export class SearchDataService {
  EMPTY_SEARCH = {q: null, qt: WordFilterType.any, overall: null};

  refreshSearch = new Subject<ChangeType>();
  private fullSeriesList!: Series[];
  seriesList!: Series[];
  itemsPerPage = 3; //20;
  currentPage = 1;
  currentPageData!: Series[];
  searchCrit: SearchData = this.EMPTY_SEARCH;

  constructor(store: Store<AppState>) {
    store.select('series').subscribe(store => {
      this.fullSeriesList = store.seriesList;
      this.redoSearchFilter();
      this.setCurrentPage(1);
      this.refreshSearch.next(ChangeType.seriesData);
    });
  }

  setCurrentPage(page: number, emit = true) {
    this.currentPage = page;
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.currentPageData = this.seriesList.slice(start, start + this.itemsPerPage);
    if (emit) {
      this.refreshSearch.next(ChangeType.currentPage);
    }
  }

  changeSearch(crit: SearchData) {
    this.searchCrit = crit;
    this.redoSearchFilter();
  }

  private cleanWordSearch(filter: string | null): string | null {
    if (!filter || !filter.trim()) {
      return null;
    }
    return filter.trim().toUpperCase();
  }

  private redoSearchFilter() {
    const wordFilter = this.cleanWordSearch(this.searchCrit.q);
    this.seriesList = this.fullSeriesList.filter(s => this.filterByWord(s, wordFilter));
    this.setCurrentPage(1, false);
    this.refreshSearch.next(ChangeType.search);
  }

  private filterByWord(series: Series, filter: string | null): boolean {
    const type = this.searchCrit.qt;
    const isAny = !this.searchCrit.qt || this.searchCrit.qt == WordFilterType.any;
    if (!filter) {
      // console.log("FilterByWord A")
      return true;
    }
    if (isAny || type == WordFilterType.author) {
      if (series.author.toUpperCase().includes(filter)) {
        // console.log("FilterByWord B", filter, series.title, series.author);
        return true;
      }
    }
    if (isAny || type == WordFilterType.series) {
      if (series.title.toUpperCase().includes(filter)) {
        // console.log("FilterByWord C", filter, series.title.toUpperCase(), series.title.toUpperCase().includes(filter));
        return true;
      }
    }
    if (isAny || type == WordFilterType.book) {
      if (series.books && Object.values(series.books).find(b => b.title.toUpperCase().includes(filter))) {
        // console.log("FilterByWord D", filter, series.title, series);
        return true;
      }
    }
    return false;
  }
}
