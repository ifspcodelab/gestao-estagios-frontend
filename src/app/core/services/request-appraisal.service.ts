import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { RequestAppraisal, RequestAppraisalCreate } from "../models/request-appraisal.model";

@Injectable({
    providedIn: 'root'
  })
export class RequestAppraisalService {
  apiUrl = `${environment.apiUrl}/advisor-requests`;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept-Language': 'pt-BR'
    })
  };
  constructor(private httpClient: HttpClient) { }

  postRequestAppraisal(advisorRequestId: string, requestAppraisal: RequestAppraisalCreate): Observable<RequestAppraisal> {
    return this.httpClient.post<RequestAppraisal>(`${this.apiUrl}/${advisorRequestId}/appraisals`, requestAppraisal, this.httpOptions);
  }
} 