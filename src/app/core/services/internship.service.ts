import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Internship } from "../models/internship.model";

@Injectable({
    providedIn: 'root'
  })
export class InternshipService {
  apiUrlStudent = `${environment.apiUrl}/students`;
  apiUrlAdvisor = `${environment.apiUrl}/advisors`;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept-Language': 'pt-BR'
    })
  };
  constructor(private httpClient: HttpClient) { }

  getByStudentId(id: string): Observable<Internship[]> {
    return this.httpClient.get<Internship[]>(`${this.apiUrlStudent}/${id}/internships`, this.httpOptions);
  }

  getByAdvisorId(id: string): Observable<Internship[]> {
    return this.httpClient.get<Internship[]>(`${this.apiUrlAdvisor}/${id}/internships`, this.httpOptions);
  }
} 