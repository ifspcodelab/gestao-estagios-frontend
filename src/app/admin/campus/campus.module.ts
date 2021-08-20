import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CampusRoutingModule } from './campus-routing.module';
import { CampusComponent } from './campus.component';
import { CampusListComponent } from './campus-list/campus-list.component';
import { CampusCreateComponent } from './campus-create/campus-create.component';
import { SharedModule } from "../../shared/shared.module";
import { ReactiveFormsModule } from "@angular/forms";
import { CampusShowComponent } from './campus-show/campus-show.component';
import { DepartmentCreateComponent } from './department-create/department-create.component';
import { CoreModule } from "../../core/core.module";


@NgModule({
  declarations: [
    CampusComponent,
    CampusListComponent,
    CampusCreateComponent,
    CampusShowComponent,
    DepartmentCreateComponent
  ],
  imports: [
    CommonModule,
    CampusRoutingModule,
    SharedModule,
    CoreModule,
    ReactiveFormsModule,
  ]
})
export class CampusModule {
}
