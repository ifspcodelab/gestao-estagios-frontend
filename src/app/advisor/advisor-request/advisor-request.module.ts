import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdvisorRequestRoutingModule } from './advisor-request-routing.module';
import { AdvisorRequestComponent } from './advisor-request.component';
import { CoreModule } from 'src/app/core/core.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdvisorRequestListComponent } from './advisor-request-list/advisor-request-list.component';


@NgModule({
  declarations: [
    AdvisorRequestComponent,
    AdvisorRequestListComponent,
  ],
  imports: [
    CommonModule,
    AdvisorRequestRoutingModule,
    CoreModule,
    SharedModule
  ]
})
export class AdvisorRequestModule { }
