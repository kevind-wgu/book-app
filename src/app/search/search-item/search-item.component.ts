import { Component, Input } from '@angular/core';
import { Series } from '../../models';
import { DatastoreService } from '../../datastore.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookmarkComponent } from '../../shared/bookmark/bookmark.component';

@Component({
  selector: 'app-search-item',
  standalone: true,
  imports: [CommonModule, RouterModule, BookmarkComponent],
  templateUrl: './search-item.component.html',
  styleUrl: './search-item.component.css'
})
export class SearchItemComponent {
  @Input() series!: Series;
  @Input() bookmarked: boolean = false;

  constructor(private datastore: DatastoreService) {}
}
