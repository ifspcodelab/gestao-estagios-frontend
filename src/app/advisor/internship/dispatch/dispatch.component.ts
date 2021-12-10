import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NotificationService } from "../../../core/services/notification.service";

@Component({
  selector: 'app-dispatch',
  templateUrl: './dispatch.component.html',
  styleUrls: ['./dispatch.component.scss']
})
export class DispatchComponent implements OnInit {

  constructor(
    private notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: { dispatch: string, title: string }
  ) { }

  ngOnInit(): void {
  }

  notifyCopiedToClipboard() {
    this.notificationService.success('Conteúdo copiado para a área de transferência.')
  }
}
