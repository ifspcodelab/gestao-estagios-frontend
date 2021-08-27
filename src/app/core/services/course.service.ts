import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Observable } from 'rxjs';
import { Course } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  apiUrl = `${environment.apiUrl}/courses`;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private httpClient: HttpClient) { }

  getCourses(): Observable<Course[]> {
    return this.httpClient.get<Course[]>(this.apiUrl, this.httpOptions);
  }
}
