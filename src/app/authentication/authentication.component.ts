import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-authentication',
  template: `
    <app-toolbar></app-toolbar>
    <router-outlet></router-outlet>
  `,

})

export class AuthenticationComponent implements OnInit {

  ngOnInit(): void {

  }

}
