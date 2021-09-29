import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AppValidators } from "../../core/validators/app-validators";
import { MatDialog } from "@angular/material/dialog";
import { TermsComponent } from "../terms/terms.component";
import {map, startWith} from "rxjs/operators";
import {Campus} from "../../core/models/campus.model";
import {Department} from "../../core/models/department.model";
import {CampusService} from "../../core/services/campus.service";
import {Observable} from "rxjs";
import {DepartmentService} from "../../core/services/department.service";
import {EntityStatus} from "../../core/models/enums/status";
import {Course} from "../../core/models/course.model";
import {Curriculum} from "../../core/models/curriculum.model";
import {CourseService} from "../../core/services/course.service";
import {CurriculumService} from "../../core/services/curriculum.service";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  hide: boolean = false;
  form: FormGroup;
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
    private fb: FormBuilder,
    private dialog: MatDialog,
    private campusService: CampusService,
    private departmentService: DepartmentService,
    private courseService: CourseService,
    private curriculumService: CurriculumService
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

  buildForm(): FormGroup {
    return this.fb.group({
      name: ['',
        [Validators.required, AppValidators.notBlank, AppValidators.alpha]
      ],
      matriculation: ['',
        [Validators.required, AppValidators.notBlank, AppValidators.exactLength(9)]
      ],
      email: ['',
        [Validators.required, Validators.email, AppValidators.notBlank]
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
      ]
    })
  }

  onLogin() {
    if (!this.form.valid) {
      return;
    }
  }

}
