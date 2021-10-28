import { AdvisorRequest } from "./advisor-request.model";

export class RequestAppraisal {
  id: string;
  createdAt: Date;
  details: string;
  isDeferred: boolean;
  meetingDate: Date;
  advisorRequest: AdvisorRequest;
}

export class RequestAppraisalCreate {
  details: string;
  isDeferred: boolean;
  meetingDate: string;
  sendEmailToAdvisor: boolean;

  constructor(details: string, isDeferred: boolean, meetingDate: string, sendEmailToAdvisor: boolean) {
    this.details = details;
    this.isDeferred = isDeferred;
    this.meetingDate = meetingDate;
    this.sendEmailToAdvisor = sendEmailToAdvisor;
  }
}