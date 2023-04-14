import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Violation } from 'src/app/core/interfaces/violation.interface';
import { Curriculum, CurriculumCreate } from 'src/app/core/models/curriculum.model';
import { CurriculumService } from 'src/app/core/services/curriculum.service';
import { AppValidators } from 'src/app/core/validators/app-validators';
import { Course } from "../../../core/models/course.model";

@Component({
  selector: 'app-curriculum-create',
  templateUrl: './curriculum-create.component.html',
  styleUrls: ['./curriculum-create.component.scss']
})
export class CurriculumCreateComponent implements OnInit {
  form: UntypedFormGroup;
  submitted: boolean = false;
  createMode: boolean;

  constructor(
    private fb: UntypedFormBuilder,
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

  buildForm(): UntypedFormGroup {
    return this.fb.group({
      code: ['',
        [Validators.required, AppValidators.notBlank]
      ],
      courseLoad: ['',
        [Validators.required, AppValidators.numeric]
      ],
      internshipCourseLoad: ['',
        [Validators.required, AppValidators.numeric]
      ],
      internshipStartCriteria: ['',
        [Validators.required, AppValidators.notBlank]
      ],
      internshipAllowedActivities: ['',
        [Validators.required, AppValidators.notBlank]
      ]
    });
  }

  field(path: string) {
    return this.form.get(path);
  }

  fieldErrors(path: string) {
    return this.field(path)?.errors;
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    if (this.createMode) {
      this.createCurriculum();
    }
    else {
      this.updateCurriculum();
    }
  }

  createCurriculum() {
    const curriculum = new CurriculumCreate(
      this.form.get("code")?.value,
      Number(this.form.get("courseLoad")?.value),
      Number(this.form.get("internshipCourseLoad")?.value),
      this.form.get("internshipStartCriteria")?.value,
      this.form.get("internshipAllowedActivities")?.value
    );
    this.curriculumService.postCurriculum(this.data.course.id, curriculum)
      .pipe()
      .subscribe(
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
          serverError: error.error.title
        });
      }
    }
  }
}
