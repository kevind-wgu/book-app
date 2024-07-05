import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { Series } from '../../shared/models.objects';
import { UsercacheService } from '../../cache/usercache.service';
import { SearchItemComponent } from '../search-item/search-item.component';
import { PaginComponent } from '../pagin/pagin.component';
import { SearchDataService } from '../search-data.service';
import { SearchFormComponent } from '../search-form/search-form.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, SearchFormComponent, SearchItemComponent, PaginComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit, OnDestroy {
  private subs: Subscription[] = [];
  series!: Series[];
  bookmarks: {[key: string]: boolean} = {};

  constructor(private cache: UsercacheService, private searchService: SearchDataService) {}

  ngOnInit(): void {
    this.setData();
    this.subs.push(this.cache.changed.subscribe(change => {
      this.setData();
    }));
    this.subs.push(this.searchService.refreshSearch.subscribe(change => {
      this.setData();
    }))
  }

  private setData() {
    this.series = this.searchService.currentPageData;
    this.bookmarks = this.cache.getBookmarks();
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }


}
