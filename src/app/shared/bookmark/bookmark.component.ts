import { Component, Input } from '@angular/core';
import { DatastoreService } from '../../datastore.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bookmark',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bookmark.component.html',
  styleUrl: './bookmark.component.css'
})
export class BookmarkComponent {
  @Input() seriesId!: string;
  @Input() bookmarked: boolean = false;

  constructor(private datastore: DatastoreService) {}

  changeBookmark() {
    this.datastore.toggleBookmark(this.seriesId, !this.bookmarked);
  }
}
