import { RequestStatus } from "./enums/request-status";
import { MonthlyReport } from "./monthly-report.model";

export class DraftMonthlyReportSubmission {
  id: string;
  submissionDate: string;
  reportStartDate: string;
  reportEndDate: string;
  draftMonthlyReportUrl: string;
  status: RequestStatus;
  details: string;
  numberOfApprovedHours: number;
  monthlyReport: MonthlyReport;
}

export class DraftMonthlyReportSubmissionUpdate {
  reportStartDate: string;
  reportEndDate: string;

  constructor(reportStartDate: string, reportEndDate: string) {
    this.reportStartDate = reportStartDate;
    this.reportEndDate = reportEndDate
  }
}

export class DraftMonthlyReportSubmissionAppraise {
  status: RequestStatus;
  details: string;
  numberOfApprovedHours: number;

  constructor (status: RequestStatus, details: string, numberOfApprovedHours: number) {
    this.status = status;
    this.details = details;
    this.numberOfApprovedHours = numberOfApprovedHours
  }
} 