import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { CoreModule } from "../core/core.module";
import { SharedModule } from "../shared/shared.module";
import { AuthenticationComponent } from "./authentication.component";
import { LoginComponent } from "./login/login.component";
import { RegistrationComponent } from "./registration/registration.component";
import { TermsComponent } from "./terms/terms.component";


@NgModule({
  declarations: [
    AuthenticationComponent,
    LoginComponent,
    RegistrationComponent,
    TermsComponent
  ],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    CoreModule,
    SharedModule
  ]
})
export class AuthenticationModule { }
