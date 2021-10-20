import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { ParametersComponent } from "./parameters.component";
import { ParametersRoutingModule } from "./parameters-routing.module";
import { ParametersCreateComponent } from "./parameters-create/parameters-create.component";

@NgModule({
  declarations: [
    ParametersComponent,
    ParametersCreateComponent
  ],
  imports: [
    CommonModule,
    ParametersRoutingModule,
    SharedModule,
    CoreModule,
  ]
})
export class ParametersModule { }
