import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdvisorRoutingModule } from './advisor-routing.module';
import { AdvisorComponent } from './advisor.component';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    AdvisorComponent
  ],
  imports: [
    CommonModule,
    AdvisorRoutingModule,
    CoreModule,
    SharedModule
  ]
})
export class AdvisorModule { }
