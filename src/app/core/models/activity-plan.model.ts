import { RequestStatus } from "./enums/request-status";
import { Internship } from "./internship.model";

export class ActivityPlan {
  id: string;
  companyName: string;
  internshipStartDate: string;
  internshipEndDate: string;
  createdAt: Date;
  expiresAt: Date;
  activityPlanUrl: string;
  status: RequestStatus;
  details: string;
  internship: Internship;
}

export class ActivityPlanUpdate {
  companyName: string;
  internshipStartDate: string;
  internshipEndDate: string;

  constructor(companyName: string, internshipStartDate: string, internshipEndDate: string) {
    this.companyName = companyName;
    this.internshipStartDate = internshipStartDate;
    this.internshipEndDate = internshipEndDate;
  }
}

export class ActivityPlanAppraisal {
  status: RequestStatus;
  details: string;
  isRequired: boolean | undefined

  constructor(status: RequestStatus, details: string, isRequired?: boolean) {
    this.status = status;
    this.details = details;
    this.isRequired = isRequired
  }
}