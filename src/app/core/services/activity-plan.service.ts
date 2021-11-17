import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { ActivityPlan, ActivityPlanAppraisal, ActivityPlanUpdate } from "../models/activity-plan.model";
import { Internship } from "../models/internship.model";

@Injectable({
    providedIn: 'root'
  })
export class ActivityPlanService {
  apiUrl = `${environment.apiUrl}/internships`;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept-Language': 'pt-BR'
    })
  };
  constructor(private httpClient: HttpClient) { }

  create(internshipId: string, data: FormData): Observable<ActivityPlan> {
    return this.httpClient.post<ActivityPlan>(`${this.apiUrl}/${internshipId}/activity-plans`, data);
  }

  update(internshipId: string, activityPlanId: string, activityPlanUpdate: ActivityPlanUpdate): Observable<ActivityPlan> {
    return this.httpClient.put<ActivityPlan>(`${this.apiUrl}/${internshipId}/activity-plans/${activityPlanId}`, activityPlanUpdate, this.httpOptions);
  }

  appraise(internshipId: string, activityPlanId: string, activityPlanAprraisal: ActivityPlanAppraisal): Observable<ActivityPlan> {
    return this.httpClient.put<ActivityPlan>(`${this.apiUrl}/${internshipId}/activity-plans/${activityPlanId}/appraisal`, activityPlanAprraisal, this.httpOptions);
  }
} 