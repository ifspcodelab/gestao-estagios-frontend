import { Internship } from "./internship.model";
import { ActivityPlan } from "./activity-plan.model";
import { ReportStatus } from "./enums/report-status";
import { DraftMonthlyReportSubmission } from "./draft-monthly-report-submission.model";
import { FinalMonthlyReportSubmission } from "./final-monthly-report-submission.model";

export class MonthlyReport {
  id: string;
  month: Date;
  draftSubmittedOnDeadline: boolean;
  finalAcceptationDate: string;
  startDate: string;
  endDate: string;
  attachmentUrl: string;
  numberOfApprovedHours: number;
  finalMonthlyReportUrl: string;
  status: ReportStatus;
  internship: Internship;
  activityPlan: ActivityPlan;
  draftMonthlyReportSubmissions: DraftMonthlyReportSubmission[];
  finalMonthlyReportSubmissions: FinalMonthlyReportSubmission[];
}