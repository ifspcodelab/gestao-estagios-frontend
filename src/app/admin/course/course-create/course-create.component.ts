import { Component, OnInit } from '@angular/core';
import { CourseService } from 'src/app/core/services/course.service';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { finalize, first, map, startWith } from "rxjs/operators";

import { CanBeSave } from "../../../core/interfaces/can-be-save.interface";
import { HttpErrorResponse } from "@angular/common/http";
import { NotificationService } from "../../../core/services/notification.service";
import { CampusService } from "../../../core/services/campus.service";
import { DepartmentService } from "../../../core/services/department.service";
import { Course, CourseCreate } from "../../../core/models/course.model";
import { Campus } from "../../../core/models/campus.model";
import { Department } from "../../../core/models/department.model";
import { LoaderService } from "../../../core/services/loader.service";
import { AppValidators } from "../../../core/validators/app-validators";
import { Observable, of } from 'rxjs';
import { EntityStatus } from 'src/app/core/models/enums/status';

@Component({
  selector: 'app-course-create',
  templateUrl: './course-create.component.html',
  styleUrls: ['./course-create.component.scss']
})
export class CourseCreateComponent implements OnInit, CanBeSave {
  loading: boolean = true;
  form: FormGroup;
  submitted = false;
  createMode: boolean;
  id: string | null;
  course: Course;

  campusFilteredOptions$: Observable<Campus[]>;
  campuses: Campus[] = [];

  departmentFilteredOptions$: Observable<Department[]>;
  departments: Department[] = [];
  departmentSelected?: Department;

  constructor(
    private courseService: CourseService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private loaderService: LoaderService,
    private campusService: CampusService,
    private departmentService: DepartmentService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');

    this.form = this.buildForm();
    this.fetchCampuses();

    if (this.id) {
      this.createMode = false;
      this.loading = true;
      this.loaderService.show();
      this.getCourse(this.id);
    } else {
      this.createMode = true;
      this.loading = false;
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

  onCampusSelected(campusSelected: string) {
    this.departments = [];

    this.field('department').setValue('');

    const campus = this.campuses.find(c => c.name == campusSelected);

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

  private refreshDepartmentValidator() {
    this.field('department').setValidators(AppValidators.autocomplete(this.departments.map(d => d.name)));
  }

  onDepartmentSelected(departmentName: string) {
    this.departmentSelected = this.departments.find(department => department.name == departmentName);
  }

  private _filterCampus(value: string): Campus[] {
    const filteredValue = value.toLowerCase()
    return this.campuses.filter(campus => campus.name.toLowerCase().includes(filteredValue));
  }

  private _filterDepartment(value: string): Department[] {
    const filteredValue = value.toLowerCase();
    return this.departments.filter(department => department.name.toLowerCase().includes(filteredValue) && department.status == EntityStatus.ENABLED);
  }

  getCourse(id: String) {
    this.courseService.getCourseById(id)
      .pipe(
        first(),
        finalize(() => {
          this.loaderService.hide();
          this.loading = false;
        })
      )
      .subscribe(
        (course: Course) => {
          this.course = course;
          this.form.patchValue(course);
          this.departmentSelected = this.course.department;
          this.departmentService.getDepartments(this.course.department.campus.id)
            .subscribe(departments => {
              this.departments = departments;
              this.departmentFilteredOptions$ = of(this.departments);
              this.departmentFilteredOptions$ = this.field('department').valueChanges.pipe(
                startWith(''),
                map(value => this._filterDepartment(value))
              );
              this.field('campus').patchValue(this.course.department.campus.name);
              this.field('department').patchValue(this.course.department.name);
              this.refreshDepartmentValidator();
            })
        },
        error => {
          if (error.status === 404) {
            this.handleNotFoundError();
          }
        }
      )
  }

  handleNotFoundError() {
    this.notificationService.error(`Curso não encontrado com id ${this.id}`)
    this.navigateToList();
  }

  field(path: string) {
    return this.form.get(path)!;
  }

  fieldErrors(path: string) {
    return this.field(path)?.errors;
  }

  buildForm(): FormGroup {
    return this.fb.group({
      name: ['',
        [Validators.required, AppValidators.notBlank, AppValidators.alpha]
      ],
      abbreviation: ['',
        [Validators.required, AppValidators.notBlank, Validators.max(10)]
      ],
      numberOfPeriods: ['',
        [Validators.required, AppValidators.numeric]
      ],
      campus: ['',
        [Validators.required]
      ],
      department: ['',
        [Validators.required]
      ]
    });
  }

  public onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    if (this.createMode) {
      this.createCourse();
    } else {
      this.updateCourse();
    }
  }

  createCourse() {
    const courseCreate = new CourseCreate(
      this.form.value.name, this.form.value.abbreviation, this.form.value.numberOfPeriods, this.departmentSelected!.id
    );
    this.courseService.postCourse(courseCreate)
      .pipe(first())
      .subscribe(
        (course: Course) => {
          this.form.reset({}, {emitEvent: false});
          this.id = course.id;
          this.course = course;
          this.notificationService.success(`Curso ${this.course.abbreviation} criado com sucesso!`);
          this.navigateToShow()
        },
        error => this.handleError(error)
      )
  }

  updateCourse() {
    if (!this.form.dirty) {
      this.navigateToShow();
      return;
    }
    const courseCreate = new CourseCreate(
      this.form.value.name, this.form.value.abbreviation, this.form.value.numberOfPeriods, this.departmentSelected!.id
    );
    this.courseService.updateCourse(this.id!, courseCreate)
      .pipe(first())
      .subscribe(
        (course: Course) => {
          this.form.reset({}, {emitEvent: false});
          this.id = course.id;
          this.course = course;
          this.notificationService.success(`Curso ${this.course.abbreviation} editado com sucesso!`);
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

      if (error.status === 409) {
        const formControl = this.form.get("abbreviation")!;
        formControl?.setErrors({
          serverError: error.error.title
        });
      }
    }
  }

  navigateToList() {
    this.router.navigate(['admin/course']);
  }

  navigateToShow() {
    this.router.navigate([`admin/course/${this.id}`]);
  }

  isDataSaved(): boolean {
    return !this.form.dirty
  }

  getBackUrl(): string {
    return this.createMode ? '/admin/course' : `/admin/course/${this.course.id}`;
  }
}
