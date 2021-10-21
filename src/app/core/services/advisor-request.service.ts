import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { AdvisorRequestCreate, AdvisorRequestForStudent } from "../models/advisor-request.model";

@Injectable({
    providedIn: 'root'
  })
export class AdvisorRequestService {
    apiUrlPost = `${environment.apiUrl}/advisor-requests`;
    apiUrlGetForStudent = `${environment.apiUrl}/advisors`;

    httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept-Language': 'pt-BR'
        })
    };
    constructor(private httpClient: HttpClient) { }

    postAdvisorRequest(advisorRequest: AdvisorRequestCreate): Observable<AdvisorRequestCreate> {
        return this.httpClient.post<AdvisorRequestCreate>(this.apiUrlPost, advisorRequest, this.httpOptions);
    }

    getAdvisorRequestForStudent(id: string): Observable<AdvisorRequestForStudent> {
        return this.httpClient.get<AdvisorRequestForStudent>(`${this.apiUrlGetForStudent}/${id}/advisor-requests`, this.httpOptions);
    }
}