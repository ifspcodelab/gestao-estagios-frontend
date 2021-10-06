import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from "./app.component";
import { AdminGuard } from './core/guards/admin.guard';
import { BlankGuard } from './core/guards/blank.guard';
import { StudentGuard } from './core/guards/student.guard';

const routes: Routes = [
  { path: '', component: AppComponent,
    children: [
      { path: 'authentication', loadChildren: () => import('./authentication/authentication.module').then(m => m.AuthenticationModule) },
      { 
        path: 'admin', 
        loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
        canActivate: [AdminGuard],
      },
      { 
        path: 'student', 
        loadChildren: () => import('./student/student.module').then(m => m.StudentModule),
        canActivate: [StudentGuard] 
      },
      { 
        path: '', 
        loadChildren: () => import('./authentication/authentication.module').then(m => m.AuthenticationModule),
        canActivate: [BlankGuard], 
      },  
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
