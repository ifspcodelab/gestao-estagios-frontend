import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-request-appraisal-create',
  templateUrl: './request-appraisal-create.component.html',
  styleUrls: ['./request-appraisal-create.component.scss']
})
export class RequestAppraisalCreateComponent implements OnInit {
  form: FormGroup;
  submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.form = this.buildForm();
  }

  field(path: string) {
    return this.form.get(path)!;
  }

  fieldErrors(path: string) {
    return this.field(path)?.errors;
  }

  buildForm(): FormGroup {
    return this.fb.group({
      // details: ['',
      //   [Validators.required]
      // ],
      // message: ['',
      //   [Validators.required]
      // ]
    });
  }
}
