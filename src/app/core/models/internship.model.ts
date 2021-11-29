import { InternshipType } from "./enums/internship-type";
import { InternshipStatus } from "./enums/InternshipStatus";
import { AdvisorRequest } from "./advisor-request.model";
import { ActivityPlan } from "./activity-plan.model";
import { MonthlyReport } from "./monthly-report.model";
import { RealizationTerm } from "./realization-term.model";

export class Internship {
  id: string;
  internshipType: InternshipType;
  status: InternshipStatus;
  advisorRequest: AdvisorRequest;
  activityPlans: ActivityPlan[];
  monthlyReports: MonthlyReport[];
  realizationTerms: RealizationTerm[];
}