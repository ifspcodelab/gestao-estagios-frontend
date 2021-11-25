import { RequestStatus } from "./enums/request-status";
import { Internship } from "./internship.model";

export class RealizationTerm {
    id: string;
    createdAt: Date;
    internshipStartDate: Date;
    internshipEndDate: Date;
    realizationTermUrl: string;
    status: RequestStatus;
    details: string;
    internship: Internship;
}

export class RealizationTermUpdate {
    internshipStartDate: string;
    internshipEndDate: string;

    constructor(internshipStartDate: string, internshipEndDate: string) {
        this.internshipStartDate = internshipStartDate;
        this.internshipEndDate = internshipEndDate;
    }
}

export class RealizationTermAppraisal {
    status: RequestStatus;
    details: string;

    constructor(status: RequestStatus, details: string) {
        this.status = status;
        this.details = details;
    }
}