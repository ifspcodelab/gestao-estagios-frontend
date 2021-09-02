import { Department } from "./department.model";
export class Course {
    id: string;
    name: string;
    abbreviation: string;
    numberOfPeriods: number;
    department: Department;
    status: string;
}

export class CourseCreate {
    name: string;
    abbreviation: string;
    numberOfPeriods: number;
    departmentId: string;

    constructor(name: string, abbreviation: string, numberOfPeriods: number, departmentId: string) {
        this.name = name;
        this.abbreviation = abbreviation;
        this.numberOfPeriods = numberOfPeriods;
        this.departmentId = departmentId;
    }
}