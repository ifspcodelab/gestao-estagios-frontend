import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { AppValidators } from "../../core/validators/app-validators";
import { MatDialog } from "@angular/material/dialog";
import { TermsComponent } from "../terms/terms.component";
import { first, map, startWith } from "rxjs/operators";
import { Campus } from "../../core/models/campus.model";
import { Department } from "../../core/models/department.model";
import { CampusService } from "../../core/services/campus.service";
import { Observable } from "rxjs";
import { DepartmentService } from "../../core/services/department.service";
import { EntityStatus } from "../../core/models/enums/status";
import { Course } from "../../core/models/course.model";
import { Curriculum } from "../../core/models/curriculum.model";
import { CourseService } from "../../core/services/course.service";
import { CurriculumService } from "../../core/services/curriculum.service";
import { UserStudentCreate } from 'src/app/core/models/student.model';
import { StudentService } from 'src/app/core/services/student.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  hide: boolean = false;
  form: UntypedFormGroup;
  submitted = false;

  campuses: Campus[];
  campusFilteredOptions$: Observable<Campus[]>;

  departments: Department[] = [];
  departmentFilteredOptions$: Observable<Department[]>;
  departmentSelected?: Department;

  courses: Course[];
  courseFilteredOptions$: Observable<Course[]>;

  curriculums: Curriculum[] = [];
  curriculumFilteredOptions$: Observable<Curriculum[]>;
  curriculumSelected?: Curriculum;

  constructor(
    private fb: UntypedFormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private campusService: CampusService,
    private departmentService: DepartmentService,
    private courseService: CourseService,
    private curriculumService: CurriculumService,
    private studentService: StudentService,
    private notificationService: NotificationService,
  ) { }

  openDialog() {
    this.dialog.open(TermsComponent);
  }

  ngOnInit() {
    this.form= this.buildForm();
    this.fetchCampuses();
    this.fetchCourse();
  }

  public onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }
  }

  fetchCampuses() {
    this.campusService.getCampuses()
      .pipe(map(courses => courses.filter(c => c.status === EntityStatus.ENABLED)))
      .subscribe(campuses => {
        this.campuses = campuses;
        this.field('campus').setValidators(AppValidators.autocomplete(this.campuses.map(c => c.name)))
        this.campusFilteredOptions$ = this.field('campus').valueChanges.pipe(
          startWith(''),
          map(value => this._filterCampus(value))
        );
      })
  }

  fetchCourse() {
    this.courseService.getCourses()
      .pipe(map(courses => courses.filter(c => c.status === EntityStatus.ENABLED)))
      .subscribe(courses => {
        this.courses = courses;
        this.field('course').setValidators(AppValidators.autocomplete(this.courses.map(c => c.name)))
        this.courseFilteredOptions$ = this.field('course').valueChanges.pipe(
          startWith(''),
          map(value => this._filterCourse(value))
        );
      })
  }

  onCampusSelected(campusSelected: string){
    this.departments = [];

    this.field('department').setValue('');

    const campus = this.campuses.find(s => s.name == campusSelected);

    if (campus) {
      this.departmentService.getDepartments(campus.id)
        .subscribe(departments => {
          this.departments = departments;
          this.refreshDepartmentValidator();
          this.departmentFilteredOptions$ = this.field('department').valueChanges.pipe(
            startWith(''),
            map(value => this._filterDepartment(value))
          );
        });
    }
  }

  onCourseSelected(courseSelected: string){
    this.curriculums = [];

    this.field('curriculum').setValue('');

    const course = this.courses.find(s => s.name == courseSelected);

    if (course) {
      this.curriculumService.getCurriculums(course.id)
        .subscribe(curriculums => {
          this.curriculums = curriculums;
          this.refreshCurriculumValidator();
          this.curriculumFilteredOptions$ = this.field('curriculum').valueChanges.pipe(
            startWith(''),
            map(value => this._filterCurriculum(value))
          );
        });
    }
  }

  private refreshDepartmentValidator() {
    this.field('department').setValidators(AppValidators.autocomplete(this.departments.map(c => c.name)));
  }

  onDepartmentSelected(departmentName: string) {
    this.departmentSelected = this.departments.find(department => department.name == departmentName);
  }

  private _filterCampus(value: string): Campus[] {
    const filteredValue = value.toLowerCase()
    return this.campuses.filter(campus => campus.name.toLowerCase().includes(filteredValue));
  }

  private _filterDepartment(value: string): Department[] {
    const filteredValues = value.toLowerCase();
    return this.departments.filter(department => department.name.toLowerCase().includes(filteredValues) && department.status == EntityStatus.ENABLED);
  }

  private refreshCurriculumValidator() {
    this.field('curriculum').setValidators(AppValidators.autocomplete(this.curriculums.map(c => c.code)));
  }

  onCurriculumSelected(curriculumName: string) {
    this.curriculumSelected = this.curriculums.find(curriculum => curriculum.code == curriculumName);
  }

  private _filterCourse(value: string): Course[] {
    const filteredValue = value.toLowerCase()
    return this.courses.filter(course => course.name.toLowerCase().includes(filteredValue));
  }

  private _filterCurriculum(value: string): Curriculum[] {
    const filteredValues = value.toLowerCase();
    return this.curriculums.filter(curriculum => curriculum.code.toLowerCase().includes(filteredValues) && curriculum.status == EntityStatus.ENABLED);
  }

  field(path: string) {
    return this.form.get(path)!;
  }

  fieldErrors(path: string) {
    return this.field(path)?.errors;
  }

  buildForm(): UntypedFormGroup {
    return this.fb.group({
      name: ['',
        [Validators.required, AppValidators.notBlank, AppValidators.alpha]
      ],
      email: ['',
        [Validators.required, Validators.email, AppValidators.notBlank, AppValidators.institutionEmail]
      ],
      registration: ['',
        [Validators.required, AppValidators.notBlank, AppValidators.exactLength(9)]
      ],
      campus: ['',
        [Validators.required, AppValidators.notBlank]
      ],
      department: ['',
        [Validators.required, AppValidators.notBlank]
      ],
      course: ['',
        [Validators.required, AppValidators.notBlank]
      ],
      curriculum: ['',
        [Validators.required, AppValidators.notBlank]
      ],
      password: ['',
        [Validators.required, AppValidators.notBlank, AppValidators.lowerCase, AppValidators.upperCase, AppValidators.number, Validators.minLength(8)]
      ],
      checkbox: ['',
        [Validators.requiredTrue]
      ]
    })
  }

  onRegister() {
    this.submitted = true; 

    if (!this.form.valid) {
      return;
    }

    const userStudentCreate = new UserStudentCreate(
      this.form.value.registration,
      this.form.value.name,
      this.form.value.password,
      this.form.value.email,
      this.curriculumSelected!.id
    )
    this.studentService.postStudent(userStudentCreate)
    .pipe(first())
      .subscribe(
        _ => {
          this.form.reset({}, {emitEvent: false});
          this.notificationService.success('Cadastro realizado com sucesso! Verifique seu e-mail para confirmação da conta');
          this.router.navigate(['authentication/login']);
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
            serverError: `Aluno já existente com matrícula ${registrationControl.value}`
          });
        }
        if (error.error.title.includes("Email")) {
          emailControl?.setErrors({
            serverError: `Aluno já existente com e-mail ${emailControl.value}`
          });
        }
      }
    }
  }

}
