import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Book, LocationData } from '../../models';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { DatastoreService } from '../../datastore.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.store';
import { setBook } from '../../store/series.store';

@Component({
  selector: 'app-add-book',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-book.component.html',
  styleUrl: './add-book.component.css'
})
export class AddBookComponent implements OnInit {
  @Input({required: true}) onCloseListener!: Subject<boolean>;
  @Input({required: true}) seriesId!: string;
  @Input() book: Book | null = null;
  form!: FormGroup;
  locationData = LocationData;

  constructor(private datastore: DatastoreService, private store: Store<AppState>) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      'title': new FormControl(this.book?.title, [Validators.required]),
      'seriesNumber': new FormControl(this.book?.seriesNumber, [Validators.required]),
      'location': new FormControl(this.book?.location, [Validators.required]),
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const book : Book = {
        id: this.book ? this.book.id : crypto.randomUUID(),
        seriesNumber: +this.form.value.seriesNumber,
        location: this.form.value.location,
        title: this.form.value.title,
      };
      console.log("Submit Book", book, this.book);
      this.datastore.upsertBook(this.seriesId, book).subscribe(res => {
        this.store.dispatch(setBook({seriesId: this.seriesId, book: book}));
        this.onClose();
      });
    }
  }

  onClose() {
    this.onCloseListener.next(false);
  }
}
