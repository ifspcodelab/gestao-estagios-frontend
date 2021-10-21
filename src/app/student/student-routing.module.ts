import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentComponent } from './student.component';

const routes: Routes = [{ path: '', component: StudentComponent }, { path: 'advisor-request', loadChildren: () => import('./advisor-request/advisor-request.module').then(m => m.AdvisorRequestModule) }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
