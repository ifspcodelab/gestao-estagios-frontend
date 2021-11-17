import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { first } from 'rxjs/operators';
import { ActivityPlanAppraisal } from 'src/app/core/models/activity-plan.model';
import { RequestStatus } from 'src/app/core/models/enums/request-status';
import { ActivityPlanService } from 'src/app/core/services/activity-plan.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-activity-plan-appraisal',
  templateUrl: './activity-plan-appraisal.component.html',
  styleUrls: ['./activity-plan-appraisal.component.scss']
})
export class ActivityPlanAppraisalComponent implements OnInit {
  form: FormGroup;
  submitted: boolean;
  activityPlanStatus: RequestStatus;
  isRequired: boolean | undefined = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { internshipId: string, activityPlanId: string, deferred: boolean },
    private dialogRef: MatDialogRef<ActivityPlanAppraisalComponent>,
    private fb: FormBuilder,
    private activityPlanService: ActivityPlanService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    const header = document.getElementById('header');
    if (this.data.deferred) {
      this.activityPlanStatus = RequestStatus.ACCEPTED;
      header!.innerHTML = "Deferir Plano";
    } 
    else {
      this.activityPlanStatus = RequestStatus.REJECTED;
      header!.innerHTML = "Indeferir Plano";
    }

    this.form = this.buildForm();
  }

  buildForm(): FormGroup {
    if (this.data.deferred) {
      return this.fb.group({
        'details': ['', [Validators.required]],
      })
    } 
    else {
      return this.fb.group({
        'details': ['', [Validators.required]]
      })
    }
  }

  field(path: string) {
    return this.form.get(path)!;
  }

  fieldErrors(path: string) {
    return this.field(path)?.errors;
  }

  onRadioChange($event: MatRadioChange): void {
    if ($event.value == 1) {
      this.isRequired = true
    }
    if ($event.value == 2) {
      this.isRequired = false;
    }
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return
    }

    if (!this.data.deferred) {
      this.isRequired = undefined;
    }
    const activityPlanAppraisal = new ActivityPlanAppraisal(
      this.activityPlanStatus,
      this.field('details').value,
      this.isRequired
    );
    this.activityPlanService.appraise(this.data.internshipId, this.data.activityPlanId, activityPlanAppraisal)
      .pipe(first())
      .subscribe(
        _ => {
          this.notificationService.success('Plano de atividades avaliado com sucesso!');
          this.dialogRef.close();
        }
      )

  }

}
