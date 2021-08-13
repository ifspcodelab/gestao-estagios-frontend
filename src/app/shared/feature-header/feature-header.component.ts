import { Component, Input, OnInit } from '@angular/core';
import { FeatureHeader } from "./feature-header.model";

@Component({
  selector: 'app-feature-header',
  templateUrl: './feature-header.component.html',
  styleUrls: ['./feature-header.component.scss']
})
export class FeatureHeaderComponent implements OnInit {
  @Input() data: FeatureHeader;

  constructor() {
  }

  ngOnInit(): void {
  }

}
