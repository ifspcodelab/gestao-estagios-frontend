import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CampusComponent } from './campus.component';
import { CampusListComponent } from "./campus-list/campus-list.component";
import { CampusCreateComponent } from "./campus-create/campus-create.component";
import { FormGuard } from "../../core/guards/form.guard";
import { CampusShowComponent } from "./campus-show/campus-show.component";

const routes: Routes = [
  {
    path: '',
    component: CampusComponent,
    children: [
      { path: '', component: CampusListComponent },
      { path: 'create', canDeactivate: [FormGuard], component: CampusCreateComponent },
      { path: ':id', component: CampusShowComponent },
      { path: ':id/edit', canDeactivate: [FormGuard], component: CampusCreateComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CampusRoutingModule {
}
