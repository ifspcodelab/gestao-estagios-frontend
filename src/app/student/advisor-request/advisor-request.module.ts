import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdvisorRequestRoutingModule } from './advisor-request-routing.module';
import { AdvisorRequestComponent } from './advisor-request.component';


@NgModule({
  declarations: [
    AdvisorRequestComponent
  ],
  imports: [
    CommonModule,
    AdvisorRequestRoutingModule
  ]
})
export class AdvisorRequestModule { }
