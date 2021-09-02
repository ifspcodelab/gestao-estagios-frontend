import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-content-cards',
  templateUrl: './content-cards.component.html',
  styleUrls: ['./content-cards.component.scss']
})
export class ContentCardsComponent implements OnInit {
  @Input() entityName: string;
  @Input() emptyState: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
