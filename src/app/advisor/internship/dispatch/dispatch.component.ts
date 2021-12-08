import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormGroup } from "@angular/forms";
import { NotificationService } from "../../../core/services/notification.service";
import {Internship} from "../../../core/models/internship.model";
import {ActivityPlan} from "../../../core/models/activity-plan.model";
import { DispatchService } from 'src/app/core/services/dispatch.service';
import { finalize, first } from 'rxjs/operators';
import { LoaderService } from 'src/app/core/services/loader.service';

@Component({
  selector: 'app-dispatch',
  templateUrl: './dispatch.component.html',
  styleUrls: ['./dispatch.component.scss']
})
export class DispatchComponent implements OnInit {
  loading: boolean = true;
  replacedDispatch: string;

  constructor(
    private dispatchService: DispatchService,
    private loaderService: LoaderService,
    private notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: { internship: Internship, activityPlan: ActivityPlan }
  ) { }

  ngOnInit(): void {
    this.loaderService.show();
    this.fetchInitialDispatch();
  }

  fetchInitialDispatch() {
    this.dispatchService.getInitialDispatch(this.data.internship.id, this.data.activityPlan.id)
      .pipe(
        first(),
        finalize(() => {
          this.loaderService.hide();
          this.loading = false;
        })
      )
      .subscribe(
        dispatch => {
          this.replacedDispatch = dispatch;
        }
      )
  }

  notifyCopiedToClipboard() {
    this.notificationService.success('Conteúdo copiado para a área de transferência.')
  }
}
