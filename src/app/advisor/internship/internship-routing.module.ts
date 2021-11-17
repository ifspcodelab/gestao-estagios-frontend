import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InternshipListComponent } from "./internship-list/internship-list.component";
import { InternshipComponent } from "./internship.component";
import { InternshipShowComponent } from "./internship-show/internship-show.component";

const routes: Routes = [
  {
    path: '', component: InternshipComponent,
    children: [
      { path: '', component: InternshipListComponent },
      { path: ':id', component: InternshipShowComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InternshipRoutingModule { }
