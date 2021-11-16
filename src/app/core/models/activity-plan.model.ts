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