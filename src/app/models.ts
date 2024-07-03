export interface RatingDetail {
  type: RatingType | ViolenceType | ProfanityType | SexType,
  label: string,
  order: number,
  title: string,
  colorClass: string,
  descr: string,
}

export enum LocationType {
  kindle = 'kindle',
  audible = 'audible',
  other = 'other',
}

type LocationDataType = {
  [key in LocationType]: string 
}

export const LocationData : LocationDataType = {
  [LocationType.kindle]: 'Kindle',
  [LocationType.audible]: 'Audible',
  [LocationType.other]: 'other',
}

export enum GenreType {
  fiction = 'fiction',
  fantasy = 'fantasy',
}

type GenreDataType = {
  [key in GenreType]: string 
}

export const GenreData : GenreDataType = {
  [GenreType.fiction]: 'Fiction',
  [GenreType.fantasy]: 'Fantasy',
}

export enum RatingType {
  ten = 10,
  nine = 9, 
  eight = 8,
  seven = 7,
  six = 6,
  five = 5,
}

type RatingDataType = {
  [key in RatingType]: RatingDetail
}

export const RatingData : RatingDataType = {
  [RatingType.ten]: {type: RatingType.ten, label: '10', order: 1, title: 'Overall', colorClass:'text-bg-success', descr:'Best Ever'},
  [RatingType.nine]: {type: RatingType.nine, label: '9', order: 2, title: 'Overall', colorClass:'text-bg-success', descr:'Excellent'},
  [RatingType.eight]: {type: RatingType.eight, label: '8', order: 3, title: 'Overall', colorClass:'text-bg-success', descr:'Good'},
  [RatingType.seven]: {type: RatingType.seven, label: '7', order: 4, title: 'Overall', colorClass:'text-bg-warning', descr:'Okay'},
  [RatingType.six]: {type: RatingType.six, label: '6', order: 5, title: 'Overall', colorClass:'text-bg-danger', descr:'Meh'},
  [RatingType.five]: {type: RatingType.five, label: '5', order: 6, title: 'Overall', colorClass:'text-bg-danger', descr:'Bad'},
}
export const RatingList = Object.values(RatingData).sort((a,b) => a.order - b.order);

export enum ViolenceType {
  lv = 'lv',
  mv = 'mv',
  hv = 'hv',
  vb = 'vb',
}

type ViolenceDataType = {
  [key in ViolenceType]: RatingDetail
}

export const ViolenceData : ViolenceDataType = {
  [ViolenceType.lv]: {type: ViolenceType.lv, label: 'LV', order: 1, title: 'Violence', colorClass: 'text-bg-success', descr: 'LV Descr'},
  [ViolenceType.mv]: {type: ViolenceType.mv, label: 'MV', order: 2, title: 'Violence', colorClass: 'text-bg-warning', descr: 'MV Descr'},
  [ViolenceType.hv]: {type: ViolenceType.hv, label: 'HV', order: 3, title: 'Violence', colorClass: 'text-bg-warning', descr: 'HV Descr'},
  [ViolenceType.vb]: {type: ViolenceType.vb, label: 'VB', order: 4, title: 'Violence', colorClass: 'text-bg-danger', descr: 'VB Descr'},
}
export const ViolenceList = Object.values(ViolenceData).sort((a,b) => a.order - b.order);

export enum ProfanityType {
  a = 'a',
  b = 'b',
  c = 'c',
  d = 'd',
  p = 'p'
}

type ProfanityDataType = {
  [key in ProfanityType]: RatingDetail
}

export const ProfanityData : ProfanityDataType = {
  [ProfanityType.a]: {type: ProfanityType.a, label: 'A', order: 1, title:'Profanity', colorClass:'text-bg-success', descr: 'A Descr'},
  [ProfanityType.b]: {type: ProfanityType.b, label: 'B', order: 2, title:'Profanity', colorClass:'text-bg-success', descr: 'B Descr'},
  [ProfanityType.c]: {type: ProfanityType.c, label: 'C', order: 3, title:'Profanity', colorClass:'text-bg-warning', descr: 'C Descr'},
  [ProfanityType.d]: {type: ProfanityType.d, label: 'D', order: 4, title:'Profanity', colorClass:'text-bg-danger', descr: 'D Descr'},
  [ProfanityType.p]: {type: ProfanityType.p, label: 'P', order: 5, title:'Profanity', colorClass:'text-bg-danger', descr: 'P Descr'},
}
export const ProfanityList = Object.values(ProfanityData).sort((a,b) => a.order - b.order);

export enum SexType {
  g = 'g',
  pg = 'pg',
  m = 'm',
  r = 'r',
}

type SexDataType = {
  [key in SexType]: RatingDetail
}

export const SexData: SexDataType = {
  [SexType.g]: {type: SexType.g, label: 'G', order: 1, title: 'Sex', colorClass:'text-bg-success', descr: 'G Descr'},
  [SexType.pg]: {type: SexType.pg, label: 'PG', order: 2, title: 'Sex', colorClass:'text-bg-success', descr: 'PG Descr'},
  [SexType.m]: {type: SexType.m, label: 'M', order: 3, title: 'Sex', colorClass:'text-bg-warning', descr: 'M Descr'},
  [SexType.r]: {type: SexType.r, label: 'R', order: 4, title: 'Sex', colorClass:'text-bg-danger', descr: 'R Descr'},
}
export const SexList = Object.values(SexData).sort((a,b) => a.order - b.order);

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

export interface Book {
  id: string
	seriesNumber: number
	location: LocationType
	title: string
}

export interface SeriesReview {
  userId: string
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

export function authFromStorageString(dataStr: string) : AuthData | null {
  if (dataStr) {
    const data = JSON.parse(dataStr);
    if (data.email && data.token && data.expireTime && data.refreshToken) {
      const expire = new Date(data.expireTime);
      return new AuthData(data.id, data.email, data.token, expire, data.refreshToken);
    }
  }
  return null;
}
