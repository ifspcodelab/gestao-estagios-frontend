import { Advisor } from "./advisor.model";
import { Curriculum } from "./curriculum.model";
import { InternshipType } from "./enums/internship-type";
import { RequestStatus } from "./enums/request-status";
import { Student } from "./student.model";

export class AdvisorRequest {
    id: string;
    createdAt: Date;
    expiresAt: Date;
    internshipType: InternshipType;
    details: string;
    status: RequestStatus;
    student: Student;
    curriculum: Curriculum;
    advisor: Advisor;
}

export class AdvisorRequestCreate {
    internshipType: InternshipType;
    details: string;
    studentId: string;
    curriculumId: string;
    advisorId: string;

    constructor(internshipType: InternshipType, details: string, studentId: string, curriculumId: string, advisorId: string) {
        this.internshipType = internshipType;
        this.details = details;
        this.studentId = studentId;
        this.curriculumId = curriculumId;
        this.advisorId = advisorId;
    }
}