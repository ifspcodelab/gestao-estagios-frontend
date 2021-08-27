import { Department } from "./department.model";


export class Course {
    id: string;
    name: string;
    abbreviation: string;
    numberOfPeriods: number;
    department: Department;
    status: string;
}
