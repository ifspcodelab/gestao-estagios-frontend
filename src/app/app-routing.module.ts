import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CampusComponent} from "./campus/campus.component";
import {DepartmentComponent} from "./department/department.component";

const routes: Routes = [
  { path: "campus", component: CampusComponent },
  { path: "departamentos", component: DepartmentComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
