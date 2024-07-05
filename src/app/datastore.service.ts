import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from "../environments/environment";
import { ErrortrackerService } from './errors/errortracker.service';
import { Bookmarks, SeriesReview, Series, Book, BookReview } from './shared/models.objects';
import { Observable, Subscription, catchError, map, of, switchMap, take, tap, throwError } from 'rxjs';
import { AppState } from './store/app.store';
import { Store } from '@ngrx/store';
import { reloadUserData } from './store/userdata.store';

const URL = environment.firebaseUrl;

export type UserData = {
  bookmarks: Bookmarks
}

type BookData = {
  data: Book,
  reviews?: {[key: string]: BookReview}
}

type SeriesData = {
  data: Series,
  reviews?: {[key: string]: SeriesReview}
  books?: {[key: string]: BookData}
}

export interface GlobalData {
  genres: {[key:string]: boolean},
}

@Injectable({
  providedIn: 'root'
})
export class DatastoreService {
  constructor(private http: HttpClient, private errortracker: ErrortrackerService, private store: Store<AppState>) { }

  // SERIES
  getSeriesList() :Observable<Series[]> {
    return this.http.get<{[key: string]: SeriesData}>(URL + '/series.json').pipe(
      map(seriesObj => {
        return this.convertSeriesData(seriesObj ? seriesObj : {});
      }),
      catchError((e, caught) => {
        this.errortracker.addError("Error Getting SeriesList", e, {caught:caught});
        return throwError(() => caught);
      }),
    );
  }

  private convertSeriesData(seriesData: {[key: string]: SeriesData}): Series[] {
      return Object.keys(seriesData).map(sid => {
        const oldSeries = seriesData[sid];
        const books = this.convertBookData(oldSeries.books ? oldSeries.books : {});
        return {...oldSeries.data, books: books, reviews: oldSeries.reviews};
      })
  }

  private convertBookData(bookData: {[key: string]: BookData}): {[key: string]: Book} {
      const books : {[key: string]: Book} = {};
      Object.keys(bookData).forEach(bid => {
        const book = bookData[bid];
        books[bid] = {...book.data, reviews: book.reviews};
      })
      return books;
  }

  updateSeries(series: Series) : Observable<any> {
    if (!series) {
      console.warn("Missing Data", series);
      throw new Error("Missing data");
    }

    return this.http.put(URL + `/series/${series.id}/data.json`, series).pipe(
      catchError((e, caught) => {
        this.errortracker.addError("Error Saving Series", e, {series: series, caught:caught});
        return throwError(() => caught);
      }),
      tap(res => console.log("Team Updated", series.id))
    );
  }

  // USER DATA
  getUserData(userId: string) :Observable<UserData> {
    return this.http.get<UserData>(URL + `/userdata/${userId}.json`).pipe(
      map(userdata => {
        if (!userdata) {
          return { bookmarks: {} };
        }
        return userdata;
      }),
      catchError((e, caught) => {
        this.errortracker.addError("Error Getting UserData", e, {caught:caught});
        return throwError(() => caught);
      }),
    );
  }

  toggleBookmark(seriesId: string, toggleOn: boolean) : Subscription {
    return this.store.select('auth').pipe(
      take(1),
      switchMap(store => {
        console.log("Toggle Bookmark", seriesId, toggleOn);
        if (store.auth) {
          const userId = store.auth.getId()
          if (toggleOn) {
            return this.addBookmark(userId, seriesId);
          }
          else {
            return this.deleteBookmark(userId, seriesId);
          }
        }
        return of();
      }),
    ).subscribe(s => {
      this.store.dispatch(reloadUserData());
    });
  }

  addBookmark(userId: string, seriesId: string) : Observable<any> {
    if (!userId || !seriesId) {
      console.warn("Missing Data", seriesId, userId);
      throw new Error("Missing data");
    }

    return this.http.put(URL + `/userdata/${userId}/bookmarks/${seriesId}.json`, true).pipe(
      catchError((e, caught) => {
        this.errortracker.addError("Error Adding Bookmark", e, true);
        return throwError(() => caught);
      }),
    ).pipe(map(res => {
      console.log("Bookmark Added", userId, seriesId);
      return 
    }));
  }

  deleteBookmark(userId: string, seriesId: string) : Observable<any> {
    if (!seriesId || !userId) {
      console.warn("Missing Data", seriesId, userId);
      throw new Error("Missing data");
    }

    return this.http.delete(URL + `/userdata/${userId}/bookmarks/${seriesId}.json`).pipe(
      catchError((e, caught) => {
        this.errortracker.addError("Error Deleting Bookmark", e, false);
        return throwError(() => caught);
      }),
    ).pipe(map(res => {
      console.log("Bookmark Removed", userId, seriesId);
      return 
    }));
  }

  upsertSeriesReview(seriesId: string, userId: string, review: SeriesReview) : Observable<any> {
    if (!seriesId || !userId || !review) {
      console.warn("Missing Data", seriesId, userId, review);
      throw new Error("Missing data");
    }

    return this.http.put(URL + `/series/${seriesId}/reviews/${userId}.json`, review).pipe(
      catchError((e, caught) => {
        this.errortracker.addError("Error Upserting SeriesReview", e, {seriesId: seriesId, userId: userId, review: review, caught:caught});
        return throwError(() => caught);
      }),
    ).pipe(map(res => {
      console.log("SeriesReview Added", seriesId, userId, review);
      return 
    }));
  }

  upsertBook(seriesId: string, book: Book) : Observable<any> {
    if (!seriesId || !book) {
      console.warn("Missing Data", seriesId, book);
      throw new Error("Missing data");
    }

    return this.http.put(URL + `/series/${seriesId}/books/${book.id}/data.json`, book).pipe(
      catchError((e, caught) => {
        this.errortracker.addError("Error Upserting Book", e, {seriesId: seriesId, book: book, caught:caught});
        return throwError(() => caught);
      }),
    ).pipe(map(res => {
      console.log("Book Added", seriesId, book);
      return 
    }));
  }

  upsertBookReview(seriesId: string, bookId: string, userId: string, review: BookReview) : Observable<any> {
    if (!seriesId || !bookId || !userId || !review) {
      console.warn("Missing Data", seriesId, bookId, userId, review);
      throw new Error("Missing data");
    }

    return this.http.put(URL + `/series/${seriesId}/books/${bookId}/reviews/${userId}.json`, review).pipe(
      catchError((e, caught) => {
        this.errortracker.addError("Error Upserting Book", e, {seriesId: seriesId, bookId: bookId, review: review, caught:caught});
        return throwError(() => caught);
      }),
      tap(_ => {
        console.log("Book Read", seriesId, bookId, review);
        return 
      }),
    );
  }

  // Global Data
  getGlobalData(): Observable<GlobalData> {
    return this.http.get<GlobalData>(URL + `/global.json`).pipe(
      map(globalData => {
        if (!globalData) {
          return {genres: {} };
        }
        return globalData;
      }),
      catchError((e, caught) => {
        this.errortracker.addError("Error Getting GlobalData", e, {caught:caught});
        return throwError(() => caught);
      }),
    );
  }

  // Global Data
  addGenere(genre: string): Observable<any> {
    if (!genre) {
      console.warn("Missing Genre");
      throw new Error("Missing genre");
    }
    return this.http.put<GlobalData>(URL + `/global/genres/${genre}.json`, {[genre]: true}).pipe(
      catchError((e, caught) => {
        this.errortracker.addError("Error Adding Genre", e, true);
        return throwError(() => caught);
      }),
      tap(() => console.log("Genre Added", genre)),
    );
  }

  deleteGenere(genre: string): Observable<any> {
    if (!genre) {
      console.warn("Missing Genre");
      throw new Error("Missing genre");
    }
    return this.http.delete<GlobalData>(URL + `/global/genres/${genre}.json`).pipe(
      catchError((e, caught) => {
        this.errortracker.addError("Error Deleting Genre", e, {caught:caught});
        return throwError(() => caught);
      }),
      tap(() => console.log("Genre Deleted", genre)),
    );
  }
}
