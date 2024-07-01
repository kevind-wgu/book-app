export interface RatingDetail {
  label: string,
  color: string,
}

export enum LocationType {
  kindle = 'kindle',
  audible = 'audible',
  other = 'other',
}

export const LocationData = {
  [LocationType.kindle]: 'Kindle',
  [LocationType.audible]: 'Audible',
  [LocationType.other]: 'other',
}

export enum RatingType {
  ten = 10,
  nine = 9, 
  eight = 8,
  seven = 7,
  six = 6,
  five = 5,
  four = 4,
  three = 3,
  two = 2,
  one = 1,
}

type RatingDataType = {
  [key in RatingType]: RatingDetail
}

export const RatingData : RatingDataType = {
  [RatingType.ten]: {label: '10', color:'green'},
  [RatingType.nine]: {label: '9', color:'green'},
  [RatingType.eight]: {label: '8', color:'green'},
  [RatingType.seven]: {label: '7', color:'yellow'},
  [RatingType.six]: {label: '6', color:'yellow'},
  [RatingType.five]: {label: '5', color:'yellow'},
  [RatingType.four]: {label: '4', color:'red'},
  [RatingType.three]: {label: '3', color:'red'},
  [RatingType.two]: {label: '2', color:'red'},
  [RatingType.one]: {label: '1', color:'red'},
}

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
  [ViolenceType.lv]: {label: 'lv', color: 'green'},
  [ViolenceType.mv]: {label: 'mv', color: 'yellow'},
  [ViolenceType.hv]: {label: 'hv', color: 'yellow'},
  [ViolenceType.vb]: {label: 'vb', color: 'red'},
}

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
  [ProfanityType.a]: {label: 'a', color: 'green'},
  [ProfanityType.b]: {label: 'b', color: 'green'},
  [ProfanityType.c]: {label: 'c', color: 'yellow'},
  [ProfanityType.d]: {label: 'd', color: 'red'},
  [ProfanityType.p]: {label: 'p', color: 'red'},

}

export enum SexType {
  g = 'G',
  pg = 'PG',
  m = 'M',
  r = 'R',
}

type SexDataType = {
  [key in SexType]: RatingDetail
}

export const SexData = {
  [SexType.g]: {label: 'G', color: 'green'},
  [SexType.pg]: {label: 'PG', color: 'green'},
  [SexType.m]: {label: 'M', color: 'yellow'},
  [SexType.r]: {label: 'R', color: 'red'},
}

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
}

export interface Book {
  id: string
	seriesId: string
	seriesNumber: number
	location: LocationType
	title: string
	imageUrl: string
	goodreadsId: string | null
	synopsis: string
}

export interface Review {
  id: string
  userId: string
  notes: string
  date: Date
  overall: RatingType
  violence: ViolenceType
  sex: SexType
  profanity: ProfanityType
}

export class AuthData {
  constructor(
    private email: string, 
    private token: string, 
    private expireDate: Date,
    private refreshToken: string,
  ) {}

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
      return new AuthData(data.email, data.token, expire, data.refreshToken);
    }
  }
  return null;
}
