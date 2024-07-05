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
  refreshSearch = new Subject<ChangeType>();
  private fullSeriesList!: Series[];
  seriesList!: Series[];
  itemsPerPage = 3; //20;
  currentPage = 1;
  currentPageData!: Series[];
  searchData: SearchData = {wordFilter: null, wordFilterType: WordFilterType.any, overall: null};

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

  changeSearch(data: SearchData) {
    this.searchData = {
      wordFilter: this.cleanWordSearch(data.wordFilter),
      wordFilterType: data.wordFilterType,
      overall: data.overall,
    }
    this.redoSearchFilter();
  }

  private cleanWordSearch(filter: string | null): string | null {
    if (!filter || !filter.trim()) {
      return null;
    }
    return filter.trim().toUpperCase();
  }

  private redoSearchFilter() {
    this.seriesList = this.fullSeriesList.filter(s => this.filterByWord(s));
    this.setCurrentPage(1, false);
    this.refreshSearch.next(ChangeType.search);
  }

  private filterByWord(series: Series): boolean {
    const filter = this.searchData.wordFilter
    const type = this.searchData.wordFilterType;
    if (!filter) {
      console.log("Filter By Word A", this.searchData);
      return true;
    }
    if (type == WordFilterType.any || type == WordFilterType.author) {
      if (series.author.toUpperCase().includes(filter)) {
        console.log("Filter By Word B", this.searchData);
        return true;
      }
    }
    if (type == WordFilterType.any || type == WordFilterType.series) {
      if (series.title.toUpperCase().includes(filter)) {
        console.log("Filter By Word C", this.searchData);
        return true;
      }
    }
    if (type == WordFilterType.any || type == WordFilterType.book) {
      if (series.books && Object.values(series.books).find(b => b.title.toUpperCase().includes(filter))) {
        return true;
      }
    }
    console.log("Filter By Word D", this.searchData);
    return false;
  }
}
