import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { DraftMonthlyReportSubmission, DraftMonthlyReportSubmissionUpdate } from "../models/draft-monthly-report-submission.model";

@Injectable({
    providedIn: 'root'
  })
export class DraftMonthlyReportSubmissionService {
  apiUrl = `${environment.apiUrl}/internships`;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept-Language': 'pt-BR'
    })
  };
  constructor(private httpClient: HttpClient) { }

  postDraftMonthlyReportSubmission(
    internshipId: string, 
    monthlyReportId: string, 
    data: FormData): Observable<DraftMonthlyReportSubmission>
  {
    return this.httpClient.post<DraftMonthlyReportSubmission>(`${this.apiUrl}/${internshipId}/monthly-reports/${monthlyReportId}/drafts`, data);
  }

  putDraftMonthlyReportSubmission(
    internshipId: string, 
    monthlyReportId: string,
    draftMonthlyReportSubmissionId: string,
    draftMonthlyReportSubmissionUpdate: DraftMonthlyReportSubmissionUpdate): Observable<DraftMonthlyReportSubmission> {
    return this.httpClient.put<DraftMonthlyReportSubmission>(
      `${this.apiUrl}/${internshipId}/monthly-reports/${monthlyReportId}/drafts/${draftMonthlyReportSubmissionId}`,
      draftMonthlyReportSubmissionUpdate,
      this.httpOptions
    );
  }
} 