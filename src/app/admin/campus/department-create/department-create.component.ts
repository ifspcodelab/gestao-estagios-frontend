import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { first } from 'rxjs/operators';
import { Violation } from 'src/app/core/interfaces/violation.interface';
import { Department } from 'src/app/core/models/department.model';
import { DepartmentService } from 'src/app/core/services/department.service';
import { AppValidators } from 'src/app/core/validators/app-validators';
import { Campus } from "../../../core/models/campus.model";

@Component({
  selector: 'app-department-create',
  templateUrl: './department-create.component.html',
  styleUrls: ['./department-create.component.scss']
})
export class DepartmentCreateComponent implements OnInit {
  form: FormGroup;
  submitted: boolean = false;
  createMode: boolean;

  constructor(
    private fb: FormBuilder,
    private departmentService: DepartmentService,
    private dialogRef: MatDialogRef<DepartmentCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { campus: Campus, department?: Department }
  ) { }

  ngOnInit(): void {
    this.form = this.buildForm();
    if (this.data.department) {
      this.createMode = false;
      this.form.patchValue(this.data.department);
    }
    else {
      this.createMode = true;
    }
    this.printHeader();
  }

  printHeader() {
    let header = document.getElementById('header');
    if (this.createMode) {
      header!.innerHTML = "Cadastrar Departamento";
    }
    else {
      header!.innerHTML = "Editar Departamento";
    }
  }

  buildForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, AppValidators.notBlank]],
      abbreviation: ['', [Validators.required, AppValidators.notBlank, AppValidators.exactLength(3)]]
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    if (this.createMode) {
      this.createDepartment();
    }
    else {
      this.updateDepartment();
    }
  }

  createDepartment() {
    this.departmentService.postDepartments(this.data.campus.id, this.form.value)
      .pipe(first())
      .subscribe(
        department => {
        this.dialogRef.close(department);
      },
      error => {
        this.handleError(error);
      }
    );
  }

  updateDepartment() {
    this.departmentService.putDepartment(this.data.campus.id, this.data.department!.id, this.form.value).subscribe(
      department => {
        this.dialogRef.close(department);
      },
      error => {
        this.handleError(error);
      }
    );
  }

  field(path: string) {
    return this.form.get(path)!;
  }

  fieldErrors(path: string) {
    return this.field(path)?.errors;
  }

  handleError(error: any) {
    if (error instanceof HttpErrorResponse) {
      console.log(error);

      if(error.status === 400) {
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

      if(error.status === 409) {
        const abbreviationControl = this.field("abbreviation");
        if (error.error.title.includes("abbreviation")) {
          abbreviationControl?.setErrors({
            serverError: `Departamento já existente com sigla ${abbreviationControl.value} para campus ${this.data.campus.abbreviation}`
          });
        }
      }
    }
  }

}
