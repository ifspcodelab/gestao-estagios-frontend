import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { Role } from 'src/app/core/models/enums/role';
import { TokenResponse } from 'src/app/core/models/token.model';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { JwtTokenService } from 'src/app/core/services/jwt-token.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import {AppValidators} from "../../core/validators/app-validators";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  hide: boolean = false;
  form: UntypedFormGroup;
  submitted = false;

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private localStorageService: LocalStorageService,
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

  buildForm(): UntypedFormGroup {
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
        this.localStorageService.set('access_token', tokenResponse.access_token);
        this.localStorageService.set('refresh_token', tokenResponse.refresh_token);
        this.handleRedirectTo();
      },
      error => { 
        this.handleError(error);
      }
    );
  }

  handleRedirectTo() {
    this.jwtTokenService.setToken(this.localStorageService.get('access_token')!);
    if (this.jwtTokenService.getRoles()!.includes(Role.ROLE_ADMIN) && !this.jwtTokenService.getRoles()!.includes(Role.ROLE_ADVISOR)) {
      this.router.navigate(['admin']);
    }
    else if (this.jwtTokenService.getRoles()!.includes(Role.ROLE_ADVISOR)) {
      this.router.navigate(['advisor']);
    }
    else {
      this.router.navigate(['student']);
    }
  }

  handleError(error: any) {
    if (error instanceof HttpErrorResponse) {
      if(error.status === 401) {
        const passwordControl = this.field("password");
        if (error.error.message.includes("credentials")) {
          passwordControl?.setErrors({
            serverError: 'Usuário inválido. Informe credenciais corretas e tente novamente.'
          });
        }
        if (error.error.message.includes("disabled")) {
          passwordControl?.setErrors({
            serverError: 'Usuário não habilitado no sistema. Verifique seu e-mail para a confirmação da conta.'
          });
        }
      }
    }
  }
}
