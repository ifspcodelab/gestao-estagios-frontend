import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
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
  campaignOne: FormGroup;
  campaignTwo: FormGroup;

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.form = this.buildForm();
    const today = new Date('dd/MM/yyyy');
    const month = today.getMonth();
    const year = today.getFullYear();
    const date = today.getDate();

      this.campaignOne = new FormGroup({
      start: new FormControl(new Date(year, date,month)),
      end: new FormControl(new Date(year, date, month)),
    });

    this.campaignTwo = new FormGroup({
      start: new FormControl(new Date(year, month, date)),
      end: new FormControl(new Date(year, month, date)),
    });
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
        [Validators.required, AppValidators.notBlank]
      ],
      internshipEndDate: ['',
        [Validators.required, AppValidators.notBlank]
      ],
    });
  }

  getBackUrl(): string {
    return this.createMode ? '/student/internship' : `/student/internship/1234`;
  }

}
