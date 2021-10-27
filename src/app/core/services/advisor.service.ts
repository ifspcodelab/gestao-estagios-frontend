import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { Advisor, UserAdvisorActivate, UserAdvisorCreate, UserAdvisorUpdate } from "../models/advisor.model";
import { EntityUpdateStatus } from "../models/status.model";

@Injectable({
  providedIn: 'root'
})
export class AdvisorService {
  apiUrl = `${environment.apiUrl}/advisors`;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept-Language': 'pt-BR'
    })
  };
  constructor(private httpClient: HttpClient) { }

  postAdvisor(advisor: UserAdvisorCreate): Observable<Advisor> {
    return this.httpClient.post<Advisor>(this.apiUrl, advisor, this.httpOptions);
  }

  getAdvisors(): Observable<Advisor[]> {
    return this.httpClient.get<Advisor[]>(this.apiUrl, this.httpOptions).pipe(
      map(results => results.sort((a, b) => a.user.name.localeCompare(b.user.name)))
    );
  }

  getAdvisorsByCourseId(id: string): Observable<Advisor[]> {
    return this.httpClient.get<Advisor[]>(`${environment.apiUrl}/courses/${id}/advisors`, this.httpOptions);
  }

  getAdvisorById(id: string): Observable<Advisor> {
    return this.httpClient.get<Advisor>(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  getAdvisorByUserId(id: string): Observable<Advisor> {
    return this.httpClient.get<Advisor>(`${environment.apiUrl}/users/${id}/advisors`, this.httpOptions)
  }

  updateAdvisor(id: string, userAdvisorUpdate: UserAdvisorUpdate): Observable<Advisor> {
    return this.httpClient.put<Advisor>(`${this.apiUrl}/${id}`, userAdvisorUpdate, this.httpOptions);
  }

  activateAdvisor(id: string, UserAdvisorActivate: UserAdvisorActivate): Observable<Advisor> {
    return this.httpClient.patch<Advisor>(`${this.apiUrl}/${id}/activate`, UserAdvisorActivate, this.httpOptions);
  }

  patchAdvisor(id: String, advisorUpdateStatus: EntityUpdateStatus): Observable<Advisor> {
    return this.httpClient.patch<Advisor>(`${this.apiUrl}/${id}`, advisorUpdateStatus, this.httpOptions);
  }
}