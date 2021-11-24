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