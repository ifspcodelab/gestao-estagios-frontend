import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Violation } from 'src/app/core/interfaces/violation.interface';
import { Curriculum } from 'src/app/core/models/curriculum.model';
import { CurriculumService } from 'src/app/core/services/curriculum.service';
import { Course } from "../../../core/models/course.model";

@Component({
  selector: 'app-curriculum-create',
  templateUrl: './curriculum-create.component.html',
  styleUrls: ['./curriculum-create.component.scss']
})
export class CurriculumCreateComponent implements OnInit {
  form: FormGroup;
  submitted: boolean = false;
  createMode: boolean;

  constructor(
    private fb: FormBuilder,
    private curriculumService: CurriculumService,
    private dialogRef: MatDialogRef<CurriculumCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { course: Course, curriculum?: Curriculum }
  ) { }

  ngOnInit(): void {
    this.form = this.buildForm();
    if (this.data.curriculum) {
      this.createMode = false;
      this.form.patchValue(this.data.curriculum);
    }
    else {
      this.createMode = true;
    }
    this.printHeader();
  }

  printHeader() {
    let header = document.getElementById('header');
    if (this.createMode) {
      header!.innerHTML = "Cadastrar Matriz";
    }
    else {
      header!.innerHTML = "Editar Matriz";
    }
  }

  buildForm(): FormGroup {
    return this.fb.group({
      code: ['', []],
      courseLoad: ['', []],
      internshipCourseLoad: ['', []],
      internshipStartCriteria: ['', []],
      internshipAllowedActivities: ['', []]
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.createMode) {
      this.createCurriculum();
    }
    else {
      this.updateCurriculum();
    }
  }

  createCurriculum() {
    this.curriculumService.postCurriculum(this.data.course.id, this.form.value).subscribe(
      curriculum => {
        this.dialogRef.close(curriculum);
      },
      error => {
        this.handleError(error);
      }
    );
  }

  updateCurriculum() {
    this.curriculumService.putCurriculum(this.data.course.id, this.data.curriculum!.id, this.form.value).subscribe(
      curriculum => {
        this.dialogRef.close(curriculum);
      },
      error => {
        this.handleError(error);
      }
    );
  }

  handleError(error: any) {
    if (error instanceof HttpErrorResponse) {
      console.log(error);

      if (error.status === 400) {
        const violations: Violation[] = error.error.violations;
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
        const formControl = this.form.get("code")!;
        formControl?.setErrors({
          serverError: `Departamento já existente com código ${this.form.value.code} para Curso ${this.data.course.abbreviation}`
        });
      }
    }
  }

}
