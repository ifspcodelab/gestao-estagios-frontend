import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
  })
export class DispatchService {
  apiUrl = `${environment.apiUrl}/internships`;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'text/plain',
      'Accept-Language': 'pt-BR'
    }),
    responseType: 'text' as 'json'
  };
  constructor(private httpClient: HttpClient) { }

  getInitialDispatch(internshipId: string, activityPlanId: String): Observable<string> {
    return this.httpClient.get<string>(`${this.apiUrl}/${internshipId}/activity-plans/${activityPlanId}/initial-dispatch`, this.httpOptions);
  }

  getFinalDispatch(internshipId: string): Observable<string> {
    return this.httpClient.get<string>(`${this.apiUrl}/${internshipId}/final-dispatch`, this.httpOptions);
  }
} 