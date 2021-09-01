import { Component, OnInit } from '@angular/core';
import { CourseService } from 'src/app/core/services/course.service';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from "@angular/forms";
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
import { Observable } from 'rxjs';

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

  //campusControl: FormControl;
  //campuses$: Observable<Campus[]>;
  campusesName: string[] = [];
  campusFilteredOptions$: Observable<string[]>;
  campuses: Campus[] = [];

  //departmentControl: FormControl;
  //departments$: Observable<Department[]>;
  departmentsName: string[] = [];
  departmentFilteredOptions$: Observable<string[]>;
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

    if (this.id) {
      this.createMode = false;
      this.loading = true;
      this.loaderService.show();
      this.getCourse(this.id);
    } else {
      this.createMode = true;
      this.loading = false;
    }

    this.form = this.buildForm();

    //this.campuses$ = this.campusService.getCampuses();
    this.campusService.getCampuses().subscribe(campuses => {
      campuses.forEach(c => this.campusesName.push(c.name))
      this.campuses = campuses;
      this.campusFilteredOptions$ = this.form.get('campus')!.valueChanges.pipe(
        startWith(''),
        map(value => this._filterCampus(value))
      );
    })
  }

  onCampusSelected(campusSelected: string) {
    this.departmentsName = [];

    //this.departmentControl.setValue('');
    this.form.get('department')!.setValue('');

    this.campuses.forEach(campus => {
      if (campus.name === campusSelected) {
        this.departmentService.getDepartments(campus.id)
          .subscribe(departmentArray => {
            departmentArray.forEach(department => this.departmentsName.push(department.name))
            this.departments = departmentArray;
            this.departmentFilteredOptions$ = this.form.get('campus')!.valueChanges.pipe(
              startWith(''),
              map(value => this._filterDepartment(value))
            );
          });
      }
    });
    this.form.get('department')!.setValidators(AppValidators.autocomplete(this.departmentsName));
  }

  onDepartmentSelected(departmentName: string) {
    this.departmentSelected = this.departments.find(department => department.name == departmentName);
  }

  private _filterCampus(value: string): string[] {
    const filteredValue = value.toLowerCase()
    return this.campusesName.filter(campus => campus.toLowerCase().includes(filteredValue));
  }

  private _filterDepartment(value: string): string[] {
    const filteredValue = value.toLowerCase();
    return this.departmentsName.filter(departmentName => departmentName.toLowerCase().includes(filteredValue));
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
          this.form.patchValue(course)
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
    return this.form.get(path);
  }

  fieldErrors(path: string) {
    return this.field(path)?.errors;
  }

  buildForm(): FormGroup {
    // this.campusControl = new FormControl('',
    //   [AppValidators.autocompleteValidator(this.campusesName)]
    // );
    // this.departmentControl = new FormControl('',
    //   //[AppValidators.autocompleteCityValidator(this.departmentsName)]
    // );
    return this.fb.group({
      name: ['',
        [Validators.required, AppValidators.notBlank, AppValidators.alpha]
      ],
      abbreviation: ['',
        [Validators.required, AppValidators.notBlank, AppValidators.exactLength(3)]
      ],
      numberOfPeriods: ['',
        [Validators.required, AppValidators.numeric]
      ],
      campus: ['',
        [AppValidators.autocomplete(this.campusesName), Validators.required]
      ],
      department: ['',
        [AppValidators.autocomplete(this.departmentsName), Validators.required]
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
          this.form.reset();
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
    this.courseService.updateCourse(this.id!, this.form.value)
      .pipe(first())
      .subscribe(
        (course: Course) => {
          this.form.reset();
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
      console.log(error);

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
