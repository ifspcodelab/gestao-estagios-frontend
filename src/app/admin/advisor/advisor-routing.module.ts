import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdvisorCreateComponent } from './advisor-create/advisor-create.component';
import { AdvisorListComponent } from './advisor-list/advisor-list.component';
import { AdvisorComponent } from './advisor.component';

const routes: Routes = [
  { 
    path: '',
    component: AdvisorComponent,
    children: [
      { path: '', component: AdvisorListComponent },
      { path: 'create', component: AdvisorCreateComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdvisorRoutingModule { }
