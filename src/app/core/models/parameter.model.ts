export class Parameter {
  id: string;
  internshipRequiredOrNotMessage: string;
  projectEquivalenceMessage: string;
  professionalValidationMessage: string;
  advisorRequestDeadline: number;
  activityPlanAppraisalDeadline: number;
  activityPlanLink: string;
  activityPlanFileSizeBytes: number;
  monthlyReportFileSizeBytes: number;
  monthlyReportDraftSubmissionDeadlineMonths: number;
  monthlyReportDraftAppraisalDeadlineDays: number;
  monthlyReportAppraisalDeadlineDays: number;
}

export class ParameterCreate {
  internshipRequiredOrNotMessage: string;
  projectEquivalenceMessage: string;
  professionalValidationMessage: string;
  advisorRequestDeadline: number;
  activityPlanAppraisalDeadline: number;
  activityPlanLink: string;
  activityPlanFileSizeBytes: number;
  monthlyReportFileSizeBytes: number;
  monthlyReportDraftSubmissionDeadlineMonths: number;
  monthlyReportDraftAppraisalDeadlineDays: number;
  monthlyReportAppraisalDeadlineDays: number;

  constructor(internshipRequiredOrNotMessage: string, projectEquivalenceMessage: string, professionalValidationMessage: string, advisorRequestDeadline: number, activityPlanAppraisalDeadline: number, activityPlanLink: string, activityPlanFileSizeBytes: number, monthlyReportFileSizeBytes: number, monthlyReportDraftSubmissionDeadlineMonths: number, monthlyReportDraftAppraisalDeadlineDays: number, monthlyReportAppraisalDeadlineDays: number) {
    this.internshipRequiredOrNotMessage = internshipRequiredOrNotMessage;
    this.projectEquivalenceMessage = projectEquivalenceMessage;
    this.professionalValidationMessage = professionalValidationMessage;
    this.advisorRequestDeadline = advisorRequestDeadline;
    this.activityPlanAppraisalDeadline = activityPlanAppraisalDeadline;
    this.activityPlanLink = activityPlanLink;
    this.activityPlanFileSizeBytes = activityPlanFileSizeBytes;
    this.monthlyReportFileSizeBytes = monthlyReportFileSizeBytes;
    this.monthlyReportDraftSubmissionDeadlineMonths = monthlyReportDraftSubmissionDeadlineMonths;
    this.monthlyReportDraftAppraisalDeadlineDays = monthlyReportDraftAppraisalDeadlineDays;
    this.monthlyReportAppraisalDeadlineDays = monthlyReportAppraisalDeadlineDays;
  }

}

