import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdvisorRequestComponent } from './advisor-request.component';

const routes: Routes = [{ path: '', component: AdvisorRequestComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdvisorRequestRoutingModule { }
