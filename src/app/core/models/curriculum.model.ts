import { Course } from "./course.model";

export class Curriculum {
  id: string;
  code: string;
  courseLoad: number;
  internshipCourseLoad: number;
  internshipStartCriteria: string;
  internshipAllowedActivities: string
  course: Course
}