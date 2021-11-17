import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { InternshipComponent } from "./internship.component";
import { InternshipListComponent } from "./internship-list/internship-list.component";
import { InternshipRoutingModule } from "./internship-routing.module";
import { InternshipShowComponent } from './internship-show/internship-show.component';

@NgModule({
  declarations: [
    InternshipComponent,
    InternshipListComponent,
    InternshipShowComponent
  ],
  imports: [
    CommonModule,
    InternshipRoutingModule,
    SharedModule,
    CoreModule,
  ]
})
export class InternshipModule { }
