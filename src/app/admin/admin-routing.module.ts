import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';


const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: 'user', loadChildren: () => import('./user/user.module').then(m => m.UserModule) },
      { path: 'campus', loadChildren: () => import('./campus/campus.module').then(m => m.CampusModule) },
      { path: 'course', loadChildren: () => import('./course/course.module').then(m => m.CourseModule) },
      { path: 'advisor', loadChildren: () => import('./advisor/advisor.module').then(m => m.AdvisorModule) },
      { path: 'account', loadChildren: () => import('./account/account.module').then(m => m.AccountModule) },
      { path: 'parameter', loadChildren: () => import('./parameter/parameter.module').then(m => m.ParameterModule) },
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
