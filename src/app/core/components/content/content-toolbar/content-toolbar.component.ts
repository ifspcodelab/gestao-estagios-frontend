import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-content-toolbar',
  templateUrl: './content-toolbar.component.html',
  styleUrls: ['./content-toolbar.component.scss']
})
export class ContentToolbarComponent implements OnInit {
  @Input() title: string = '';
  @Input() backUrl: string | undefined;
  constructor() { }

  ngOnInit(): void {
  }

}
