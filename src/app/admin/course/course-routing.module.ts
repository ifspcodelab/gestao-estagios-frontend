import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseListComponent } from './course-list/course-list.component';
import { CourseComponent } from './course.component';
import { FormGuard } from "../../core/guards/form.guard";
import { CourseCreateComponent } from './course-create/course-create.component';
import { CourseShowComponent } from './course-show/course-show.component';

const routes: Routes = [
  {
    path: '', component: CourseComponent,
    children: [
      { path: '', component: CourseListComponent },
      { path: 'create', canDeactivate: [FormGuard], component: CourseCreateComponent },
      { path: ':id/edit', canDeactivate: [FormGuard], component: CourseCreateComponent },
      { path: ':id', component: CourseShowComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourseRoutingModule { }
