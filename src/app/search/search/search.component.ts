import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { Series } from '../../models';
import { DatastoreService } from '../../datastore.service';
import { UsercacheService } from '../../cache/usercache.service';
import { SearchItemComponent } from '../search-item/search-item.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, SearchItemComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit, OnDestroy {
  private subs: Subscription[] = [];
  series!: Series[];
    // { id: '1', author: 'Brandon Sanderson', genre: 'Fiction', reviewUrl: 'url', title: 'Mistborn', imageUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1617768316i/68428.jpg', goodreadsId: '12345', synopsis: 'A good book 1', complete: true},
    // { id: '2', author: 'Seth Ring', genre: 'LitRPG, Fantasy', reviewUrl: 'url', title: 'The Titan Series', imageUrl: 'https://m.media-amazon.com/images/I/51GrqW+tb9L._SY445_SX342_.jpg', goodreadsId: '12345', synopsis: 'A good book 2', complete: true },
    // { id: '3', author: 'Domagoj Kurmaic', genre: 'LitRPG, Fantasy', reviewUrl: 'url', title: 'Mother of Learning', imageUrl: 'https://m.media-amazon.com/images/I/51HDq8Zqk+L._SY445_SX342_.jpg', goodreadsId: '12345', synopsis: 'A good book 3', complete: true },
    // { id: '4', author: 'Arthur Stone', genre: 'LitRPG, Fantasy', reviewUrl: 'url', title: 'Alpha', imageUrl: 'https://m.media-amazon.com/images/I/51VZDy9DL4L._SY445_SX342_.jpg', goodreadsId: '12345', synopsis: 'A good book 4', complete: false },

  bookmarks: {[key: string]: boolean} = {};

  constructor(private cache: UsercacheService, private datastore: DatastoreService) {}

  ngOnInit(): void {
    this.setData();
    this.subs.push(this.cache.changed.subscribe(change => {
      this.setData();
    }));
  }

  private setData() {
    this.series = this.cache.getSeriesList();
    this.bookmarks = this.cache.getBookmarks();
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }


}
