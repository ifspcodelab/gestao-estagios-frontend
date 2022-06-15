import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Observable } from 'rxjs';
import { Course, CourseCreate } from '../models/course.model';
import { EntityUpdateStatus } from '../models/status.model';
import { map } from "rxjs/operators";
import {EntityStatus} from "../models/enums/status";


@Injectable({
  providedIn: 'root'
})
export class CourseService {
  apiUrl = `${environment.apiUrl}/courses`;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept-Language': 'pt-BR'
    })
  };

  constructor(private httpClient: HttpClient) { }

  postCourse(course: CourseCreate): Observable<Course> {
    return this.httpClient.post<any>(this.apiUrl, course, this.httpOptions);
  }

  getCourses(): Observable<Course[]> {
    return this.httpClient.get<Course[]>(this.apiUrl, this.httpOptions).pipe(
      map(results => results.sort((a, b) => a.name.localeCompare(b.name)))
    );
  }

  getAllCoursesByStatus(status: EntityStatus): Observable<Course[]> {
    return this.httpClient.get<Course[]>(`${this.apiUrl}?status=${status}`, this.httpOptions).pipe(
      map(results => results.sort((a, b) => a.name.localeCompare(b.name)))
    );
  }

  getCourseById(id: String): Observable<Course> {
    return this.httpClient.get<Course>(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  updateCourse(id: String, course: CourseCreate): Observable<Course> {
    return this.httpClient.put<Course>(`${this.apiUrl}/${id}`, course, this.httpOptions);
  }

  deleteCourse(id: String): Observable<unknown> {
    return this.httpClient.delete(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  patchCampus(id: String, courseUpdateStatus: EntityUpdateStatus): Observable<Course> {
    return this.httpClient.patch<Course>(`${this.apiUrl}/${id}`, courseUpdateStatus, this.httpOptions);
  }
}
