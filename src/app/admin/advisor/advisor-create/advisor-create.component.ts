import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, first, map } from 'rxjs/operators';
import { Advisor, UserAdvisorCreate, UserAdvisorUpdate } from 'src/app/core/models/advisor.model';
import { Campus } from 'src/app/core/models/campus.model';
import { Course } from 'src/app/core/models/course.model';
import { Department } from 'src/app/core/models/department.model';
import { Role } from 'src/app/core/models/enums/role';
import { EntityStatus } from 'src/app/core/models/enums/status';
import { AdvisorService } from 'src/app/core/services/advisor.service';
import { CampusService } from 'src/app/core/services/campus.service';
import { CourseService } from 'src/app/core/services/course.service';
import { DepartmentService } from 'src/app/core/services/department.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { AppValidators } from 'src/app/core/validators/app-validators';

@Component({
  selector: 'app-advisor-create',
  templateUrl: './advisor-create.component.html',
  styleUrls: ['./advisor-create.component.scss']
})
export class AdvisorCreateComponent implements OnInit {
  loading: boolean;
  createMode: boolean;
  form: UntypedFormGroup;
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
    private fb: UntypedFormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private loaderService: LoaderService,
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');

    this.form = this.buildForm();
    this.fetchCampuses();

    if(this.id) {
      this.createMode = false;
      this.loading = true;
      this.loaderService.show();
      this.fetchAdvisor(this.id);
    } else {
      this.createMode = true;
      this.loading = false;
    }

    if (!this.createMode) {
      this.fetchCourses();
    }
  }

  fetchAdvisor(id: string) {
    this.advisorService.getAdvisorById(id)
    .pipe(
      first(),
      finalize(() => {
        this.loaderService.hide();
        this.loading = false;
      })
    )
    .subscribe(
      (advisor: Advisor) => {
        this.advisor = advisor;
        this.field('admin').disable();
        this.field('name').patchValue(advisor.user.name);
        this.field('registration').patchValue(advisor.user.registration);
        this.field('registration').disable();
        this.field('email').patchValue(advisor.user.email);
        this.coursesList = advisor.courses;
        this.coursesIds = this.coursesList.map(c => c.id);
      },
      error => {
        if(error.status >= 400 || error.status <= 499) {
          this.notificationService.error(`Orientador não encontrado com id ${this.id}`);
          this.navigateToList();
        }
      }
    )
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

  buildForm(): UntypedFormGroup {
    return this.fb.group({
      registration: ['', [ Validators.required, AppValidators.notBlank ]],
      name: ['', [ Validators.required, AppValidators.notBlank ]],
      email: ['', [ Validators.required, Validators.email, AppValidators.notBlank, AppValidators.institutionEmail ]],
      campus: ['',],
      department: ['',],
      course: ['',],
      admin: ['', ]
    });
  }

  public onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    if (this.createMode) {
      this.createAdvisor()
    }
    else {
      this.updateAdvisor();
    }
  }


  handleIsAdmin() {
    this.isAdmin = this.isAdmin == false ? true : false;
  }

  createAdvisor() {
    const roles = this.isAdmin == true ? [Role.ROLE_ADMIN, Role.ROLE_ADVISOR] : [Role.ROLE_ADVISOR]
    const userAdvisorCreate = new UserAdvisorCreate (
      this.form.value.registration,
      this.form.value.name,
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

  updateAdvisor() {
    const userAdvisorUpdate = new UserAdvisorUpdate(
      this.form.value.name,
      this.form.value.email,
      this.coursesIds
    );
    this.advisorService.updateAdvisor(this.id!, userAdvisorUpdate)
    .pipe(first())
    .subscribe(
      (advisor: Advisor) => {
        this.form.reset({}, {emitEvent: false});
        this.id = advisor.id
        this.advisor = advisor;
        this.notificationService.success(`Orientador ${this.advisor.user.name} editado com sucesso!`);
        this.navigateToShow();
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

      if(error.status === 409) {
        const registrationControl = this.field("registration");
        const emailControl = this.field("email");
        if (error.error.title.includes("Registration")) {
          registrationControl?.setErrors({
            serverError: `Usuário já existente com matrícula ${registrationControl.value}`
          });
        }
        if (error.error.title.includes("Email")) {
          emailControl?.setErrors({
            serverError: `Usuário já existente com e-mail ${emailControl.value}`
          });
        }
      }
    }
  }

  navigateToList() {
    this.router.navigate(['admin/advisor']);
  }

  navigateToShow() {
    this.router.navigate([`admin/advisor/${this.id}`]);
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
    this.field('course').setValue('');
  }

  getBackUrl() {
    return this.createMode ? '/admin/advisor' : `/admin/advisor/${this.advisor.id}`;
  }
}
