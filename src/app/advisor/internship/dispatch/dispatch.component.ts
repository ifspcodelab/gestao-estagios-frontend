import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Parameter } from "../../../core/models/parameter.model";
import { FormGroup } from "@angular/forms";
import {NotificationService} from "../../../core/services/notification.service";

@Component({
  selector: 'app-dispatch',
  templateUrl: './dispatch.component.html',
  styleUrls: ['./dispatch.component.scss']
})
export class DispatchComponent implements OnInit {
  form: FormGroup;

  constructor(
    private notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: { parameter: Parameter }
  ) { }

  ngOnInit(): void {
  }

  copyCode(val: string){
    let textBox = document.createElement('textarea');
    textBox.value = val;
    document.body.appendChild(textBox);
    textBox.select();
    document.execCommand('copy');

    this.notificationService.success("Texto copiado para área de transferência!");
  }
}
