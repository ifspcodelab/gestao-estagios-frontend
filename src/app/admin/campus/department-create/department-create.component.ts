import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Violation } from 'src/app/core/interfaces/violation.interface';
import { Department } from 'src/app/core/models/department.model';
import { DepartmentService } from 'src/app/core/services/department.service';

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
    @Inject(MAT_DIALOG_DATA) public data: { campusId: string, department: Department | null, campusAbbreviation: string }
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
      name: ['', []],
      abbreviation: ['', []]
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.createMode) {
      this.createDepartment();
    }
    else {
      this.updateDepartment();
    }
  }

  createDepartment() {
    this.departmentService.postDepartments(this.data.campusId, this.form.value).subscribe(
      department => {
        this.dialogRef.close(department);
      },
      error => {
        this.handleError(error);        
      }
    );
  }

  updateDepartment() {
    this.departmentService.putDepartment(this.data.campusId, this.data.department!.id, this.form.value).subscribe(
      department => {
        this.dialogRef.close(department);
      },
      error => {
        this.handleError(error);        
      }
    );
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
        const formControl = this.form.get("abbreviation")!;
        formControl?.setErrors({
          serverError: `Departamento já existente com abreviação ${this.form.value.abbreviation} para Campus ${this.data.campusAbbreviation}`
        });
      }
    }
  }

}
