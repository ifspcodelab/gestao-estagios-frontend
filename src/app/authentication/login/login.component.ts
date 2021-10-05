import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { TokenResponse } from 'src/app/core/models/token.model';
import { AuthenticationService } from 'src/app/core/services/auth.service';
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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

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
      registration: ['',
        [Validators.required, AppValidators.notBlank]
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

    this.authenticationService.login(this.form.value.registration, this.form.value.password)
      .pipe(first())
      .subscribe(
        (tokenResponse: TokenResponse) => {
          localStorage.setItem('access_token', tokenResponse.access_token)
          localStorage.setItem('refresh_token', tokenResponse.refresh_token)
          this.router.navigate(['admin'])
        }
      )
  }
}
