import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { CoreModule } from "../core/core.module";
import { SharedModule } from "../shared/shared.module";
import { AuthenticationComponent } from "./authentication.component";
import { LoginComponent } from "./login/login.component";
import { RegistrationComponent } from "./registration/registration.component";
import { TermsComponent } from "./terms/terms.component";
import { PasswordComponent } from './password/password.component';
import { ResetComponent } from './reset/reset.component';


@NgModule({
  declarations: [
    AuthenticationComponent,
    LoginComponent,
    RegistrationComponent,
    TermsComponent,
    PasswordComponent,
    ResetComponent,
  ],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    CoreModule,
    SharedModule
  ]
})
export class AuthenticationModule { }
