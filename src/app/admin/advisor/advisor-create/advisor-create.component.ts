import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { Advisor, UserAdvisorCreate } from 'src/app/core/models/advisor.model';
import { Campus } from 'src/app/core/models/campus.model';
import { Course } from 'src/app/core/models/course.model';
import { Department } from 'src/app/core/models/department.model';
import { Role } from 'src/app/core/models/enums/role';
import { EntityStatus } from 'src/app/core/models/enums/status';
import { AdvisorService } from 'src/app/core/services/advisor.service';
import { CampusService } from 'src/app/core/services/campus.service';
import { CourseService } from 'src/app/core/services/course.service';
import { DepartmentService } from 'src/app/core/services/department.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { AppValidators } from 'src/app/core/validators/app-validators';

@Component({
  selector: 'app-advisor-create',
  templateUrl: './advisor-create.component.html',
  styleUrls: ['./advisor-create.component.scss']
})
export class AdvisorCreateComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  isAdmin = false;
  id: string | null;
  advisor: Advisor;

  campusFilteredOptions$: Observable<Campus[]>;
  campuses: Campus[] = [];

  departmentFilteredOptions$: Observable<Department[]>;
  departments: Department[] = [];
  departmentSelected?: Department;

  courseFilteredOptions$: Observable<Course[]>;
  courses: Course[] = [];
  courseSelected?: Course;

  coursesIds: string[] = [];
  coursesList: Course[] = [];

  constructor(
    private advisorService: AdvisorService,
    private campusService: CampusService,
    private departmentService: DepartmentService,
    private courseService: CourseService,
    private fb: FormBuilder,
    private router: Router,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.form = this.buildForm();
    this.fetchCampuses();
  }

  fetchCampuses() {
    this.campusService.getCampuses()
      .pipe(map(courses => courses.filter(c => c.status === EntityStatus.ENABLED)))
      .subscribe(campuses => {
        this.campuses = campuses;
      })
  }

  fetchCourses() {
    this.courseService.getCourses()
        .pipe(map(courses => courses.filter(c => c.department.id === this.departmentSelected!.id && !this.coursesIds.includes(c.id))))
        .subscribe(courses => {
          this.courses = courses;
        })
  }

  onCampusSelected(campusSelected: string) {
    this.departments = [];

    this.field('department').setValue('');

    const campus = this.campuses.find(c => c.name == campusSelected);

    if (campus) {
      this.departmentService.getDepartments(campus.id)
        .subscribe(departments => {
          this.departments = departments;
        });
    }
  }

  refreshDepartmentValidator() {
    this.field('department').setValidators(AppValidators.autocomplete(this.departments.map(d => d.name)));  
  }

  onDepartmentSelected(departmentName: string) {
    this.courses = [];

    this.field('course').setValue('');

    this.departmentSelected = this.departments.find(department => department.name == departmentName);

    if (this.departmentSelected) {
      this.fetchCourses();
    }
  }

  onCourseSelected(courseName: string) {
    this.courseSelected = this.courses.find(course => course.name == courseName);
  }

  field(path: string) {
    return this.form.get(path)!;
  }

  fieldErrors(path: string) {
    return this.field(path)?.errors;
  }

  buildForm(): FormGroup {
    return this.fb.group({
      registration: ['', [Validators.required, AppValidators.notBlank]],
      name: ['', [Validators.required, AppValidators.notBlank]],
      password: ['', [Validators.required, AppValidators.notBlank, Validators.minLength(6), Validators.maxLength(22)]],
      email: ['', [Validators.required, AppValidators.notBlank, Validators.email]],
      campus: ['',],
      department: ['',],
      course: ['',]
    });
  }

  public onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.createAdvisor();
  }

  
  handleIsAdmin() {
    this.isAdmin = this.isAdmin == false ? true : false;
  }

  createAdvisor() {
    const roles = this.isAdmin == true ? [Role.ROLE_ADMIN, Role.ROLE_ADVISOR] : [Role.ROLE_ADVISOR]
    const userAdvisorCreate = new UserAdvisorCreate (
      this.form.value.registration,
      this.form.value.name,
      this.form.value.password,
      this.form.value.email,
      roles,
      this.coursesIds
    );
    this.advisorService.postAdvisor(userAdvisorCreate)
      .pipe(first())
      .subscribe(
        (advisor: Advisor) => {
          this.form.reset({}, {emitEvent: false});
          this.id = advisor.id
          this.advisor = advisor;
          this.notificationService.success(`Orientador ${this.advisor.user.name} criado com sucesso!`);
          this.navigateToList();
        },
        error => this.handleError(error)
      )
  }

  handleError(error: any) {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 400) {
        const violations: Array<{ name: string; reason: string }> = error.error.violations;
        violations.forEach(violation => {
          const formControl = this.form.get(violation.name);
          if (formControl) {
            formControl.setErrors({
              serverError: violation.reason
            });
          }
        })
      }
    }
  }

  navigateToList() {
    this.router.navigate(['admin/advisor']);
  }

  addCourse() {
    if (this.courseSelected) {
      this.coursesList!.push(this.courseSelected!);
      this.coursesIds = this.coursesList.map(c => c.id);
      this.field('course').setValue('');
      this.courseSelected = undefined;
      this.fetchCourses();
    }
  }

  removeCourse(course: Course) {
    this.coursesList = this.coursesList!.filter(c => c.id != course.id);
    this.coursesIds = this.coursesIds.filter(c => c != course.id);

    this.fetchCourses();
  }
}
