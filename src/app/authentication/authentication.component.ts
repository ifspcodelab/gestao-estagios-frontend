import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-authentication',
  template: `
    <mat-toolbar color="primary">
      <span>Gestão Estágios</span>
    </mat-toolbar>
    <router-outlet></router-outlet>
  `,

})

export class AuthenticationComponent implements OnInit {

  ngOnInit(): void {

  }

}
