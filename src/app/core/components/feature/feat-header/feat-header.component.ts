import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-feat-header',
  templateUrl: './feat-header.component.html',
  styleUrls: ['./feat-header.component.scss']
})
export class FeatHeaderComponent {
  @Input() title: string = '';
  @Input() backUrl: string | undefined;
}
