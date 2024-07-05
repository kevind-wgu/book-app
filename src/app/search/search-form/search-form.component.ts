import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { WordFilterType } from '../../shared/models.types';
import { CommonModule } from '@angular/common';
import { Subscription, debounceTime } from 'rxjs';
import { SearchDataService } from '../search-data.service';


@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.css'
})
export class SearchFormComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  WordFilterEnum= WordFilterType;
  subs: Subscription[] = [];

  constructor(private searchData: SearchDataService) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      wordFilter: new FormControl(''),
      wordFilterType: new FormControl(WordFilterType.any),
      overall: new FormControl(''),
    });

    this.subs.push(this.form.valueChanges.pipe(debounceTime(500)).subscribe(change => {
      this.searchData.changeSearch(this.form.value);
    }));
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }
}
