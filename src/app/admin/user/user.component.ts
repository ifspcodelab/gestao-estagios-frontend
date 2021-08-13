import { Component, OnInit } from '@angular/core';
import { FeatureHeader } from "../../shared/feature-header/feature-header.model";

@Component({
  selector: 'app-user',
  template: `
    <app-feature-header [data]="data"></app-feature-header>
    <router-outlet></router-outlet>
  `
})
export class UserComponent implements OnInit {
  data: FeatureHeader

  constructor() {
  }

  ngOnInit(): void {
    this.data =  {
      name: "Usuário",
      pluralize: "Usuários"
    }
  }

}
