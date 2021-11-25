import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { RealizationTerm, RealizationTermAppraisal, RealizationTermUpdate } from "../models/realization-term.model";

@Injectable({
    providedIn: 'root'
  })
  export class RealizationTermService {
    apiUrl = `${environment.apiUrl}/internships`;

    httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept-Language': 'pt-BR'
        })
    };

    constructor(private httpClient: HttpClient) { }

    create(internshipId: string, dataRealizationTerm: FormData): Observable<RealizationTerm> {
        return this.httpClient.post<RealizationTerm>(`${this.apiUrl}/${internshipId}/realization-terms`, dataRealizationTerm);
    }

    update(internshipId: string, realizationTermId: string, realizationTermUpdate: RealizationTermUpdate): Observable<RealizationTerm> {
        return this.httpClient.put<RealizationTerm>(`${this.apiUrl}/${internshipId}/realization-terms/${realizationTermId}`, realizationTermUpdate, this.httpOptions);
    }

    appraise(internshipId: string, realizationTermId: string, realizationTermAprraisal: RealizationTermAppraisal): Observable<RealizationTerm> {
        return this.httpClient.put<RealizationTerm>(`${this.apiUrl}/${internshipId}/realization-terms/${realizationTermId}/appraisal`, realizationTermAprraisal, this.httpOptions);
    }
  }