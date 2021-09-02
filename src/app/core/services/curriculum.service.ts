import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Observable } from 'rxjs';
import { Curriculum } from '../models/curriculum.model';

@Injectable({
  providedIn: 'root'
})
export class CurriculumService {
  readonly apiUrl = `${environment.apiUrl}/courses`;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept-Language': 'pt-BR'
    })
  };

  constructor(private httpClient: HttpClient) { }

  postCurriculum(courseId: string, curriculum: Curriculum): Observable<Curriculum> {
    const url = `${this.apiUrl}/${courseId}/curriculums`;
    return this.httpClient.post<Curriculum>(url, curriculum, this.httpOptions);
  }

  getCurriculums(courseId: string): Observable<Curriculum[]> {
    const url = `${this.apiUrl}/${courseId}/curriculums`;
    return this.httpClient.get<Curriculum[]>(url, this.httpOptions);
  }

  putCurriculum(courseId: string, curriculumId: string, curriculum: Curriculum): Observable<Curriculum> {
    const url = `${this.apiUrl}/${courseId}/curriculums/${curriculumId}`;
    return this.httpClient.put<Curriculum>(url, curriculum, this.httpOptions);
  }

  deleteCurriculum(courseId: string, curriculumId: string): Observable<unknown> {
    const url = `${this.apiUrl}/${courseId}/curriculums/${curriculumId}`;
    return this.httpClient.delete(url, this.httpOptions);
  }
}