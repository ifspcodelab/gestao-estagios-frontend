import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-content-detail-section',
  templateUrl: './content-detail-section.component.html',
  styleUrls: ['./content-detail-section.component.scss']
})
export class ContentDetailSectionComponent implements OnInit {
  @Input() emptyState: boolean = false;
  @Input() icon: string | undefined;
  @Input() title: string | undefined;
  @Output() openDialogEvent = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  openDialog() {
    this.openDialogEvent.emit('open');
  }

}
