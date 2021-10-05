import { Curriculum } from "./curriculum.model";
import { Role } from "./enums/role";
import { User } from "./user.model";

export class Student {
  id: string;
  user: User;
  curriculum: Curriculum;
}

export class UserStudentCreate {
  registration: string;
  name: string;
  password: string;
  email: string;
  curriculumId: string;

  constructor(registration: string, name: string, password: string, email: string, curriculumId: string) {
    this.registration = registration;
    this.name = name;
    this.password = password;
    this.email = email;
    this.curriculumId = curriculumId;
  }
}
