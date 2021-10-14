import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthenticationComponent} from "./authentication.component";
import {LoginComponent} from "./login/login.component";
import {RegistrationComponent} from "./registration/registration.component";
import {PasswordComponent} from "./password/password.component";
import {ResetComponent} from "./reset/reset.component";
import {VerificationComponent} from "./verification/verification.component";
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Routes = [
  {
    path: '',
    component: AuthenticationComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'registration', component: RegistrationComponent },
      { path: 'password', component: PasswordComponent },
      { path: 'reset/:id', component: ResetComponent },
      { path: 'reset-password/:id', component: ResetPasswordComponent },
      { path: 'verification/:id', component: VerificationComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
