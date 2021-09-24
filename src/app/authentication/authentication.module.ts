import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { CoreModule } from "../core/core.module";
import { SharedModule } from "../shared/shared.module";
import { AuthenticationComponent } from "./authentication.component";
import { RegistrationComponent } from './registration/registration.component';


@NgModule({
  declarations: [
    AuthenticationComponent,
  ],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    CoreModule,
    SharedModule
  ]
})
export class AuthenticationModule { }
