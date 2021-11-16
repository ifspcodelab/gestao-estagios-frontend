import { InternshipType } from "./enums/internship-type";
import { InternshipStatus } from "./enums/InternshipStatus";
import { AdvisorRequest } from "./advisor-request.model";
import { ActivityPlan } from "./activity-plan.model";

export class Internship {
  id: string;
  internshipType: InternshipType;
  status: InternshipStatus;
  advisorRequest: AdvisorRequest;
  activityPlans: ActivityPlan[];
}