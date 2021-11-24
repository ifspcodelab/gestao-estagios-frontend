import { RequestStatus } from "./enums/request-status";
import { MonthlyReport } from "./monthly-report.model";

export class FinalMonthlyReportSubmission {
  id: string;
  submissionDate: string;
  finalMonthlyReportUrl: string;
  status: RequestStatus;
  details: string;
  monthlyReport: MonthlyReport;
}