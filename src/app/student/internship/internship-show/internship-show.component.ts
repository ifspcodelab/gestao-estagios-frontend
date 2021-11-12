import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AppValidators } from "../../../core/validators/app-validators";

@Component({
  selector: 'app-internship-show',
  templateUrl: './internship-show.component.html',
  styleUrls: ['./internship-show.component.scss']
})
export class InternshipShowComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  createMode: boolean;

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.form = this.buildForm();
  }

  public onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }
  }

  field(path: string) {
    return this.form.get(path)!;
  }

  fieldErrors(path: string) {
    return this.field(path)?.errors;
  }

  buildForm(): FormGroup {
    return this.fb.group({
      companyName: ['',
        [Validators.required, AppValidators.notBlank]
      ],
      internshipStartDate: ['',
        [Validators.required]
      ],
      internshipEndDate: ['',
        [Validators.required]
      ],
      pdf: ['',
        [Validators.required]
      ],
    });
  }

  getBackUrl(): string {
    return this.createMode ? '/student/internship' : `/student/internship/1234`;
  }

}
