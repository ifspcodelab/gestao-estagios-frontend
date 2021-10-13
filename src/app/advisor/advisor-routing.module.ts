import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdvisorComponent } from './advisor.component';

const routes: Routes = [{ path: '', component: AdvisorComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdvisorRoutingModule { }
