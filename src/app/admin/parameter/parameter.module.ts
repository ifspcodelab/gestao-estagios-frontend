import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { ParameterComponent } from "./parameter.component";
import { ParameterRoutingModule } from "./parameter-routing.module";
import { ParameterCreateComponent } from "./parameter-create/parameter-create.component";

@NgModule({
  declarations: [
    ParameterComponent,
    ParameterCreateComponent
  ],
  imports: [
    CommonModule,
    ParameterRoutingModule,
    SharedModule,
    CoreModule,
  ]
})
export class ParameterModule { }
