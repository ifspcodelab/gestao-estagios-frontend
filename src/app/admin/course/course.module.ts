import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CourseRoutingModule } from './course-routing.module';
import { CourseComponent } from './course.component';
import { CourseListComponent } from './course-list/course-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';


@NgModule({
  declarations: [
    CourseComponent,
    CourseListComponent
  ],
  imports: [
    CommonModule,
    CourseRoutingModule,
    SharedModule,
    CoreModule,
  ]
})
export class CourseModule { }
