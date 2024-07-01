import { Component } from '@angular/core';
import { Series } from '../../models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  series: Series[] = [
    { id: '1', author: 'Brandon Sanderson', genre: 'Fiction', reviewUrl: 'url', title: 'Mistborn', imageUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1617768316i/68428.jpg', goodreadsId: '12345', synopsis: 'A good book 1', complete: true},
    { id: '1', author: 'Seth Ring', genre: 'LitRPG, Fantasy', reviewUrl: 'url', title: 'The Titan Series', imageUrl: 'https://m.media-amazon.com/images/I/51GrqW+tb9L._SY445_SX342_.jpg', goodreadsId: '12345', synopsis: 'A good book 2', complete: true },
    { id: '1', author: 'Domagoj Kurmaic', genre: 'LitRPG, Fantasy', reviewUrl: 'url', title: 'Mother of Learning', imageUrl: 'https://m.media-amazon.com/images/I/51HDq8Zqk+L._SY445_SX342_.jpg', goodreadsId: '12345', synopsis: 'A good book 3', complete: true },
    { id: '1', author: 'Arthur Stone', genre: 'LitRPG, Fantasy', reviewUrl: 'url', title: 'Alpha', imageUrl: 'https://m.media-amazon.com/images/I/51VZDy9DL4L._SY445_SX342_.jpg', goodreadsId: '12345', synopsis: 'A good book 4', complete: false },
  ];

  constructor() {}

}
