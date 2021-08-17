import { Component, OnInit } from '@angular/core';
import { CampusService } from "../../../core/services/campus.service";
import {
  FormBuilder,
  FormControl,
  FormGroup
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { CanBeSave } from "../../../core/interfaces/can-be-save.interface";
import { HttpErrorResponse } from "@angular/common/http";
import { NotificationService } from "../../../core/services/notification.service";
import { Campus } from "../../../core/models/campus.model";

@Component({
  selector: 'app-campus-create',
  templateUrl: './campus-create.component.html',
  styleUrls: ['./campus-create.component.scss']
})
export class CampusCreateComponent implements OnInit, CanBeSave {
  form: FormGroup;
  submitted = false;
  createMode: boolean;
  id: string | null;
  campus: Campus;

  constructor(
    private campusService: CampusService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');

    if(this.id) {
      this.createMode = false;
      this.getCampus(this.id);
    } else {
      this.createMode = true;
    }

    this.form = this.buildForm();
  }

  getCampus(id: String) {
    this.campusService.getCampusById(id).subscribe(
      campus => {
        console.log(campus)
        this.campus = campus;
        this.form.patchValue(campus)
      }, error => {
        if(error.status === 404) {
          this.handleNotFoundError();
        }
      }
    )
  }

  handleNotFoundError() {
    this.notificationService.error(`Campus não encontrado com id ${this.id}`)
    this.navigateToList();
  }


  // TODO: move to another place for reuse (https://angular.io/guide/form-validation#defining-custom-validators)
  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  // buildForm(): FormGroup {
  //   return this.fb.group({
  //     name: ['', [Validators.required, this.noWhitespaceValidator]],
  //     abbreviation: ['', [Validators.required]],
  //     address: this.fb.group({
  //       postalCode: ['', [Validators.required]],
  //       street: ['', [Validators.required]],
  //       neighborhood: ['', [Validators.required]],
  //       city: ['', [Validators.required]],
  //       state: ['', [Validators.required]],
  //       number: ['', [Validators.required]],
  //       complement: ['', []]
  //     }),
  //     internshipSector: this.fb.group({
  //       telephone: ['', [Validators.required]],
  //       email: ['', [Validators.required, Validators.email]],
  //       website: ['', [Validators.required]]
  //     })
  //   });
  // }

  buildForm(): FormGroup {
    return this.fb.group({
      name: ['', []],
      abbreviation: ['', []],
      address: this.fb.group({
        postalCode: ['', []],
        street: ['', []],
        neighborhood: ['', []],
        city: ['', []],
        state: ['', []],
        number: ['', []],
        complement: ['', []]
      }),
      internshipSector: this.fb.group({
        telephone: ['', []],
        email: ['', []],
        website: ['', []]
      })
    });
  }

  public onSubmit() {
    this.submitted = true;
    // console.log(this.form)
    // console.log(JSON.stringify(this.form.value, null, 2));

    // if (this.form.invalid) {
    //   return;
    // }
    if(this.form.value.address.complement == '') {
      this.form.value.address.complement = null
    }

    if(this.createMode) {
      this.createCampus();
    } else {
      this.updateCampus();
    }
  }

  createCampus() {
    this.campusService.postCampus(this.form.value).subscribe(
      campus => {
        this.form.reset();
        this.id = campus.id;
        this.campus = campus;
        this.notificationService.success(`Campus ${this.campus.abbreviation} criado com sucesso!`);
        this.navigateToShow()
      }, error => this.handleError(error)
    )
  }

  updateCampus() {
    this.campusService.updateCampus(this.id!, this.form.value).subscribe(
      campus => {
        this.form.reset();
        this.id = campus.id;
        this.campus = campus;
        this.notificationService.success(`Campus ${this.campus.abbreviation} editado com sucesso!`);
        this.navigateToShow();
      }, error => this.handleError(error)
    )
  }

  handleError(error: any) {
    if (error instanceof HttpErrorResponse) {
      console.log(error);

      if(error.status === 400) {
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
        const formControl = this.form.get("abbreviation")!;
        formControl?.setErrors({
          serverError: error.error.title
        });
      }
    }
  }

  navigateToList() {
    this.router.navigate(['admin/campus']);
  }

  navigateToShow() {
    this.router.navigate([`admin/campus/${this.id}`]);
  }

  isDataSaved(): boolean {
    return !this.form.dirty
  }
}
