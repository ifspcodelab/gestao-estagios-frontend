import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AppValidators } from "../../core/validators/app-validators";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

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
      name: ['',
        [Validators.required, AppValidators.notBlank, AppValidators.alpha]
      ],
      matriculation: ['',
        [Validators.required, AppValidators.notBlank, AppValidators.exactLength(9)]
      ],
      email: ['',
        [Validators.required, Validators.email, AppValidators.notBlank]
      ],
      password: ['',
        [Validators.required, AppValidators.notBlank, AppValidators.lowerCase, AppValidators.upperCase, AppValidators.number, AppValidators.special, Validators.minLength(9)]
      ]
    })
  }

  onLogin() {
    if (!this.form.valid) {
      return;
    }
  }

}
