import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { AdvisorRequest, AdvisorRequestCreate } from "../models/advisor-request.model";

@Injectable({
    providedIn: 'root'
  })
export class AdvisorRequestService {
  apiUrl = `${environment.apiUrl}/advisor-requests`;
  apiUrlStudent = `${environment.apiUrl}/students`;
  apiUrlAdvisor = `${environment.apiUrl}/advisors`;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept-Language': 'pt-BR'
    })
  };
  constructor(private httpClient: HttpClient) { }

  postAdvisorRequest(advisorRequest: AdvisorRequestCreate): Observable<AdvisorRequestCreate> {
    return this.httpClient.post<AdvisorRequestCreate>(this.apiUrl, advisorRequest, this.httpOptions);
  }

  getById(id: string): Observable<AdvisorRequest> {
    return this.httpClient.get<AdvisorRequest>(`${this.apiUrl}/${id}`, this.httpOptions); 
  }

  getByStudentId(id: string): Observable<AdvisorRequest[]> {
    return this.httpClient.get<AdvisorRequest[]>(`${this.apiUrlStudent}/${id}/advisor-requests`, this.httpOptions);
  }

  getByAdvisorId(id: string): Observable<AdvisorRequest[]> {
    return this.httpClient.get<AdvisorRequest[]>(`${this.apiUrlAdvisor}/${id}/advisor-requests`, this.httpOptions);
  }
} 