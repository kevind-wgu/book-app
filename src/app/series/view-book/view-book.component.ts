import { Component, Input, OnInit } from '@angular/core';
import { Book, LocationType } from '../../models';
import { CommonModule, NgIf } from '@angular/common';
import { AddBookComponent } from '../add-book/add-book.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-view-book',
  standalone: true,
  imports: [CommonModule, AddBookComponent],
  templateUrl: './view-book.component.html',
  styleUrl: './view-book.component.css'
})
export class ViewBookComponent implements OnInit {
  @Input({required: true}) seriesId!: string;
  @Input({required: true}) book!: Book;
  LocationType = LocationType;
  closeEditBook = new Subject<boolean>();
  edit = false;

  ngOnInit(): void {
    this.closeEditBook.subscribe(_ => {
      this.edit = false;
    })
  }

  onEdit() {
    this.edit = true;
  }
}
