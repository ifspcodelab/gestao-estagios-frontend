export class Parameter {
  id: string;
  internshipRequiredOrNotMessage: string;
  projectEquivalenceMessage: string;
  professionalValidationMessage: string;
  advisorRequestDeadline: number;
  activityPlanAppraisalDeadline: number;
  activityPlanLink: string;
  activityPlanFileSizeMegabytes: number;
  monthlyReportFileSizeMegabytes: number;
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
  activityPlanFileSizeMegabytes: number;
  monthlyReportFileSizeMegabytes: number;
  monthlyReportDraftSubmissionDeadlineMonths: number;
  monthlyReportDraftAppraisalDeadlineDays: number;
  monthlyReportAppraisalDeadlineDays: number;

  constructor(internshipRequiredOrNotMessage: string, projectEquivalenceMessage: string, professionalValidationMessage: string, advisorRequestDeadline: number, activityPlanAppraisalDeadline: number, activityPlanLink: string, activityPlanFileSizeMegabytes: number, monthlyReportFileSizeMegabytes: number, monthlyReportDraftSubmissionDeadlineMonths: number, monthlyReportDraftAppraisalDeadlineDays: number, monthlyReportAppraisalDeadlineDays: number) {
    this.internshipRequiredOrNotMessage = internshipRequiredOrNotMessage;
    this.projectEquivalenceMessage = projectEquivalenceMessage;
    this.professionalValidationMessage = professionalValidationMessage;
    this.advisorRequestDeadline = advisorRequestDeadline;
    this.activityPlanAppraisalDeadline = activityPlanAppraisalDeadline;
    this.activityPlanLink = activityPlanLink;
    this.activityPlanFileSizeMegabytes = activityPlanFileSizeMegabytes;
    this.monthlyReportFileSizeMegabytes = monthlyReportFileSizeMegabytes;
    this.monthlyReportDraftSubmissionDeadlineMonths = monthlyReportDraftSubmissionDeadlineMonths;
    this.monthlyReportDraftAppraisalDeadlineDays = monthlyReportDraftAppraisalDeadlineDays;
    this.monthlyReportAppraisalDeadlineDays = monthlyReportAppraisalDeadlineDays;
  }

}

