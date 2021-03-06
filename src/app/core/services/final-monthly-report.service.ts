import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { FinalMonthlyReportSubmission, FinalMonthlyReportSubmissionAppraise } from "../models/final-monthly-report-submission.model";

@Injectable({
    providedIn: 'root'
  })
export class FinalMonthlyReportSubmissionService {
  apiUrl = `${environment.apiUrl}/internships`;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept-Language': 'pt-BR'
    })
  };
  constructor(private httpClient: HttpClient) { }

  postFinalMonthlyReportSubmission(
    internshipId: string, 
    monthlyReportId: string, 
    data: FormData): Observable<FinalMonthlyReportSubmission>
  {
    return this.httpClient.post<FinalMonthlyReportSubmission>(`${this.apiUrl}/${internshipId}/monthly-reports/${monthlyReportId}/finals`, data);
  }

  appraiseFinalMonthlyReportSubmission(
    internshipId: string, 
    monthlyReportId: string,
    finalMonthlyReportSubmissionId: string,
    finalMonthlyReportSubmissionAppraise: FinalMonthlyReportSubmissionAppraise
  ): Observable<FinalMonthlyReportSubmission> {
    return this.httpClient.put<FinalMonthlyReportSubmission>(
      `${this.apiUrl}/${internshipId}/monthly-reports/${monthlyReportId}/finals/${finalMonthlyReportSubmissionId}/appraisals`,
      finalMonthlyReportSubmissionAppraise,
      this.httpOptions
    );
  }
} 