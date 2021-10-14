import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountEditComponent } from './account-edit/account-edit.component';
import { AccountShowComponent } from './account-show/account-show.component';
import { AccountComponent } from './account.component';

const routes: Routes = [
  {
    path: '', component: AccountComponent,
    children: [
      { path: ':registration', component: AccountShowComponent },
      { path: ':registration/edit', component: AccountEditComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
