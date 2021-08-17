import { Component, Input, OnInit } from '@angular/core';
import { Location } from "@angular/common";

@Component({
  selector: 'app-feature-header',
  templateUrl: './feature-header.component.html',
  styleUrls: ['./feature-header.component.scss']
})
export class FeatureHeaderComponent implements OnInit {
  @Input() title: string = '';
  @Input() backArrow: boolean = false;

  constructor(public location: Location) {
  }

  ngOnInit(): void {
  }
}
