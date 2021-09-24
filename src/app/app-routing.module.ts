import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from "./app.component";
import { LoginComponent } from "./authentication/login/login.component";
import {RegistrationComponent } from "./authentication/registration/registration.component";

const routes: Routes = [
  { path: '', component: AppComponent,
    children: [
      { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
      { path: 'authentication', loadChildren: () => import('./authentication/authentication.module').then(m => m.AuthenticationModule) },
      { path: '', redirectTo: 'authentication/login', pathMatch: 'full' }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
