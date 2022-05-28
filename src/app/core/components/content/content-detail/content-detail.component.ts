import { Component, Input, OnInit } from '@angular/core';

export interface ListItens {
  itens: ListItemDetail[]
}

export interface ListItemDetail {
  icon: string;
  title: string;
  lines: string[]
}

@Component({
  selector: 'app-content-detail',
  templateUrl: './content-detail.component.html',
  styleUrls: ['./content-detail.component.scss']
})
export class ContentDetailComponent implements OnInit {
  @Input() title: string | undefined;
  @Input() subtitle: string | undefined;
  @Input() subtitle2: string | undefined;
  @Input() listItens: ListItens | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
