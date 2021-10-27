import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdvisorComponent } from './advisor.component';

const routes: Routes = [
  { 
    path: '', 
    component: AdvisorComponent,
    children: [
      { path: 'advisor-request', loadChildren: () => import('./advisor-request/advisor-request.module').then(m => m.AdvisorRequestModule) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdvisorRoutingModule { }
