import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { Advisor, UserAdvisorCreate } from "../models/advisor.model";

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

  getAdvisorById(id: string): Observable<Advisor> {
    return this.httpClient.get<Advisor>(`${this.apiUrl}/${id}`, this.httpOptions);
  }
}