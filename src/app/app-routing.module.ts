import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CampusComponent} from "./campus/campus.component";

const routes: Routes = [
  { path: "campus", component: CampusComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
