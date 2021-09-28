import { Course } from "./course.model";
import { Role } from "./enums/role";
import { User } from "./user.model";

export class Advisor {
  id: string;
  user: User;
  courses: Course[]
}

export class UserAdvisorCreate {
  registration: string;
  name: string;
  password: string;
  email: string;
  roles: Role[];
  coursesIds: string[];

  constructor(registration: string, name: string, password: string, email: string, roles: Role[], coursesIds: string[]) {
    this.registration = registration;
    this.name = name;
    this.password = password;
    this.email = email;
    this.roles = roles; 
    this.coursesIds = coursesIds;
  }
}