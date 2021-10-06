import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { Role } from 'src/app/core/models/enums/role';
import { TokenResponse } from 'src/app/core/models/token.model';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { JwtTokenService } from 'src/app/core/services/jwt-token.service';
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
    private authenticationService: AuthenticationService,
    private jwtTokenService: JwtTokenService
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
    this.submitted = true;

    if (!this.form.valid) {
      return;
    }

    this.authenticationService.login(this.form.value.registration, this.form.value.password)
      .pipe(first())
      .subscribe(
      (tokenResponse: TokenResponse) => {
        localStorage.setItem('access_token', tokenResponse.access_token);
        localStorage.setItem('refresh_token', tokenResponse.refresh_token);
        this.jwtTokenService.setToken(localStorage.getItem('access_token')!);
        if (this.jwtTokenService.getRoles()!.includes(Role.ROLE_ADMIN)) {
          this.router.navigate(['admin']);
        }
        else {
          this.router.navigate(['student']);
        }
      },
      error => { 
        this.handleError(error);
      }
    );
  }

  handleError(error: any) {
    if (error instanceof HttpErrorResponse) {
      if(error.status === 401) {
        const registrationControl = this.field("registration");
        const passwordControl = this.field("password");
        if (error.error.message.includes("credentials")) {
          passwordControl?.setErrors({
            serverError: 'Usuário inválido. Informe credenciais corretas e tente novamente.'
          });
          registrationControl?.setErrors({
            serverError: 'Usuário inválido. Informe credenciais corretas e tente novamente.'
          });
        }
      }
    }
  }
}
