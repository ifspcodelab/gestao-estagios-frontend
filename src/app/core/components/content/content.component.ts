import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-content',
  template: `
    <div *ngIf="!loading">
      <ng-content select="app-content-toolbar"></ng-content>
      <ng-content select="app-content-main"></ng-content>
    </div>
  `
})
export class ContentComponent implements OnInit {
  @Input() loading: boolean;
  constructor() { }

  ngOnInit(): void {
  }

}
