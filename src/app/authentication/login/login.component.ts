import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import {AppValidators} from "../../core/validators/app-validators";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  hide: boolean = false;
  form: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.form= this.buildForm();
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
      email: ['',
        [Validators.required, Validators.email, AppValidators.notBlank]
      ],
      password: ['',
        [Validators.required, AppValidators.notBlank]
      ]
    })
  }

  onLogin() {
    if (!this.form.valid) {
      return;
    }
  }

}
