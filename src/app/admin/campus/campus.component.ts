import { Component, OnInit } from '@angular/core';
import { FeatureHeader } from "../../shared/feature-header/feature-header.model";

@Component({
  selector: 'app-campus',
  template:`
    <app-feature-header [data]="data"></app-feature-header>
    <router-outlet></router-outlet>
  `
})
export class CampusComponent implements OnInit {
  data: FeatureHeader

  constructor() { }

  ngOnInit(): void {
    this.data =  {
      name: "Campus",
      pluralize: "Campus",
      newAction: {
        url: "/admin/campus/create"
      }
    }
  }
}
