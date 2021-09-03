import { Course } from "./course.model";

export class Curriculum {
  id: string;
  code: string;
  courseLoad: number;
  internshipCourseLoad: number;
  internshipStartCriteria: string;
  internshipAllowedActivities: string;
  course: Course;
}

export class CurriculumCreate {
  code: string;
  courseLoad: number;
  internshipCourseLoad: number;
  internshipStartCriteria: string;
  internshipAllowedActivities: string;

  constructor(code: string, courseLoad: number, internshipCourseLoad: number, internshipStartCriteria: string, internshipAllowedActivities: string) {
    this.code = code;
    this.courseLoad = courseLoad;
    this.internshipCourseLoad = internshipCourseLoad;
    this.internshipStartCriteria = internshipStartCriteria;
    this.internshipAllowedActivities = internshipAllowedActivities;
  }


}