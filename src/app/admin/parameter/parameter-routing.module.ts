import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParameterComponent } from "./parameter.component";
import { ParameterCreateComponent } from "./parameter-create/parameter-create.component";

const routes: Routes = [
  {
    path: '', component: ParameterComponent,
    children: [
      { path: '', component: ParameterCreateComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParameterRoutingModule { }
