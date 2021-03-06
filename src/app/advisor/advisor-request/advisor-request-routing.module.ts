import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdvisorRequestListComponent } from './advisor-request-list/advisor-request-list.component';
import { AdvisorRequestShowComponent } from './advisor-request-show/advisor-request-show.component';
import { AdvisorRequestComponent } from './advisor-request.component';

const routes: Routes = [
  { 
    path: '', 
    component: AdvisorRequestComponent,
    children: [
      { path: '', component: AdvisorRequestListComponent },
      { path: ':id', component: AdvisorRequestShowComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdvisorRequestRoutingModule { }
