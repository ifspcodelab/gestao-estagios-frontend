import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CampusRoutingModule } from './campus-routing.module';
import { CampusComponent } from './campus.component';
import { CampusListComponent } from './campus-list/campus-list.component';
import { CampusCreateComponent } from './campus-create/campus-create.component';
import { SharedModule } from "../../shared/shared.module";
import { ReactiveFormsModule } from "@angular/forms";
import { CampusShowComponent } from './campus-show/campus-show.component';


@NgModule({
  declarations: [
    CampusComponent,
    CampusListComponent,
    CampusCreateComponent,
    CampusShowComponent
  ],
  imports: [
    CommonModule,
    CampusRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class CampusModule {
}
