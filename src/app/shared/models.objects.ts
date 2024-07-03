import { LocationType, ProfanityType, RatingType, SexType, ViolenceType } from "./models.types"

export interface Series {
  id: string
  author: string
  genre: string
  reviewUrl: string | null
  title: string
  imageUrl: string
  goodreadsId: string | null
  synopsis: string
  complete: boolean
  reviews?: {[key: string]: SeriesReview}
  books?: {[key: string]: Book}
}

export type SeriesSet = {[key: string]: Series}

export interface BookReview {
  userId: string,
  date: Date,
  overall: RatingType,
}

export interface Book {
  id: string
	seriesNumber: number
	location: LocationType
	title: string
  reviews?: {[key: string]: BookReview}
}

export interface SeriesReview {
  userId: string
  userName: string
  notes: string
  date: Date
  overall: RatingType
  violence: ViolenceType
  sex: SexType
  profanity: ProfanityType
}

export type Bookmarks = {[key: string]: boolean}

export class AuthData {
  constructor(
    private id: string,
    private email: string, 
    private token: string, 
    private expireDate: Date,
    private refreshToken: string,
  ) {}

  getId() : string {
    return this.id;
  }

  getEmail() : string {
    return this.email;
  }

  getToken() : string {
    return this.token;
  }

  isValid() : boolean {
    return !!this.token && !!this.expireDate && this.expireDate.getTime() > new Date().getTime();
  }

  getRefreshToken() : string {
    return this.refreshToken;
  }

  toStorageString() : string {
    return JSON.stringify({
      id: this.id,
      email: this.email,
      token: this.token,
      expireTime: this.expireDate.getTime(),
      refreshToken: this.refreshToken
    });
  }

}

