import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Series } from '../../shared/models.objects';
import { ChangeType, SearchDataService } from '../search-data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pagin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagin.component.html',
  styleUrl: './pagin.component.css'
})
export class PaginComponent implements OnInit, OnDestroy {
  private paginBeforeAfter = 3;
  private subs : Subscription[] = [];
  currentPage: number = 1;
  pages: number[] = [1];
  paginView: number[] = [];
  moreBefore: boolean = false;
  moreAfter: boolean = false;

  constructor(private searchData: SearchDataService) {
  }

  ngOnInit(): void {
    this.setPagin();
    this.subs.push(this.searchData.refreshSearch.subscribe(changed => {
      if (changed == ChangeType.currentPage) {
        this.setPaginView();
      }
      else {
        this.setPagin();
      }
    }));
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  onChangePage(newPage: number) {
    var changePage = newPage;
    if (newPage < 1) {
      changePage = 1;
    }
    else if (newPage > this.pages[this.pages.length-1]) {
      changePage = this.pages[this.pages.length-1];
    }

    this.searchData.setCurrentPage(changePage);
  }

  private setPagin() {
    const seriesList = this.searchData.seriesList;

    const newPages = [1];
    var i = 1;
    for (; i < seriesList.length / this.searchData.itemsPerPage; i++) {
      newPages.push(i+1)
    }

    this.pages = newPages;
    this.setPaginView();
  }

  private setPaginView() {
    this.currentPage = this.searchData.currentPage;
    const newPaginView : number[] = [];

    for (var i = this.paginBeforeAfter; i > 0; i--) {
      const page = this.currentPage - i;
      if (page > 0) {
        newPaginView.push(page);
        this.moreBefore = true;
      }
    }

    newPaginView.push(this.currentPage);

    for (var i = 1; i < this.paginBeforeAfter; i++) {
      const page = this.currentPage + i;
      if (page <= this.pages[this.pages.length-1]) {
        newPaginView.push(page);
        this.moreAfter = true;
      }
    }
    this.paginView = newPaginView;
  }
}
