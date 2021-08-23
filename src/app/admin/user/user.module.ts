import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserCreateComponent } from './user-create/user-create.component';
import { SharedModule } from "../../shared/shared.module";
import { CoreModule } from "../../core/core.module";

@NgModule({
  declarations: [
    UserComponent,
    UserListComponent,
    UserCreateComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
    CoreModule,
  ]
})
export class UserModule { }
