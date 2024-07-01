import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from "../environments/environment";
import { ErrortrackerService } from './errors/errortracker.service';

const URL = environment.firebaseUrl;

@Injectable({
  providedIn: 'root'
})
export class DatastoreService {
  constructor(private http: HttpClient, private errortracker: ErrortrackerService) { }

}
