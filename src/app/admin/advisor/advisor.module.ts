import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdvisorRoutingModule } from './advisor-routing.module';
import { AdvisorComponent } from './advisor.component';
import { AdvisorListComponent } from './advisor-list/advisor-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { AdvisorCreateComponent } from './advisor-create/advisor-create.component';
import { AdvisorShowComponent } from './advisor-show/advisor-show.component';


@NgModule({
  declarations: [
    AdvisorComponent,
    AdvisorListComponent,
    AdvisorCreateComponent,
    AdvisorShowComponent
  ],
  imports: [
    CommonModule,
    AdvisorRoutingModule,
    SharedModule,
    CoreModule,
  ]
})
export class AdvisorModule { }
