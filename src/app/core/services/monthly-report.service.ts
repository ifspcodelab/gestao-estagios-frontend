import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { MonthlyReport } from "../models/monthly-report.model";

@Injectable({
    providedIn: 'root'
  })
export class MonthlyReportService {
  apiUrl = `${environment.apiUrl}/internships`;

  constructor(private httpClient: HttpClient) { }

  putMonthlyReport(
    internshipId: string, 
    monthlyReportId: string, 
    data: FormData): Observable<MonthlyReport>
  {
    return this.httpClient.put<MonthlyReport>(
      `${this.apiUrl}/${internshipId}/monthly-reports/${monthlyReportId}/attachments`,
      data
    );
  }
} 