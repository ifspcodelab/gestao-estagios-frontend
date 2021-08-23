import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-content',
  template: `
    <div>
      <ng-content select="app-content-toolbar"></ng-content>
      <ng-content select="app-content-main"></ng-content>
    </div>
  `
})
export class ContentComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }
}
