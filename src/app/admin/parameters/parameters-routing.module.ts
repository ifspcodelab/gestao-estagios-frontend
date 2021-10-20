import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParametersComponent } from "./parameters.component";
import { ParametersCreateComponent } from "./parameters-create/parameters-create.component";

const routes: Routes = [
  {
    path: '', component: ParametersComponent,
    children: [
      { path: '', component: ParametersCreateComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParametersRoutingModule { }
