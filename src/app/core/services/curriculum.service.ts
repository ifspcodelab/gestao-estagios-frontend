import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Observable } from 'rxjs';
import { Curriculum, CurriculumCreate } from '../models/curriculum.model';
import { EntityUpdateStatus } from '../models/status.model';
import { map } from "rxjs/operators";
import {EntityStatus} from "../models/enums/status";

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

  postCurriculum(courseId: string, curriculum: CurriculumCreate): Observable<Curriculum> {
    const url = `${this.apiUrl}/${courseId}/curriculums`;
    return this.httpClient.post<Curriculum>(url, curriculum, this.httpOptions);
  }

  getCurriculums(courseId: string): Observable<Curriculum[]> {
    const url = `${this.apiUrl}/${courseId}/curriculums`;
    return this.httpClient.get<Curriculum[]>(url, this.httpOptions).pipe(
      map(results => results.sort((a, b) => a.code.localeCompare(b.code)))
    );
  }

  getCurriculumsByStatus(courseId: string, status: EntityStatus): Observable<Curriculum[]>{
    const url = `${this.apiUrl}/${courseId}/curriculums?=${status}`;
    return this.httpClient.get<Curriculum[]>(url, this.httpOptions).pipe(
      map(results => results.sort((a, b) => a.code.localeCompare(b.code)))
    );
  }

  putCurriculum(courseId: string, curriculumId: string, curriculum: CurriculumCreate): Observable<Curriculum> {
    const url = `${this.apiUrl}/${courseId}/curriculums/${curriculumId}`;
    return this.httpClient.put<Curriculum>(url, curriculum, this.httpOptions);
  }

  deleteCurriculum(courseId: string, curriculumId: string): Observable<unknown> {
    const url = `${this.apiUrl}/${courseId}/curriculums/${curriculumId}`;
    return this.httpClient.delete(url, this.httpOptions);
  }

  patchCurriculum(courseId: string, curriculumId: string, curriculumUpdateStatus: EntityUpdateStatus): Observable<Curriculum> {
    return this.httpClient.patch<Curriculum>(`${this.apiUrl}/${courseId}/curriculums/${curriculumId}`, curriculumUpdateStatus, this.httpOptions);
  }
}
