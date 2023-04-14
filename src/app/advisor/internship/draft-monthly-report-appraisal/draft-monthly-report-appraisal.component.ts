import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { first } from 'rxjs/operators';
import { DraftMonthlyReportSubmissionAppraise } from 'src/app/core/models/draft-monthly-report-submission.model';
import { RequestStatus } from 'src/app/core/models/enums/request-status';
import { DraftMonthlyReportSubmissionService } from 'src/app/core/services/draft-monthly-report.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-draft-monthly-report-appraisal',
  templateUrl: './draft-monthly-report-appraisal.component.html',
  styleUrls: ['./draft-monthly-report-appraisal.component.scss']
})
export class DraftMonthlyReportAppraisalComponent implements OnInit {
  form: UntypedFormGroup;
  submitted: boolean;
  draftStatus: RequestStatus;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { internshipId: string, monthlyReportId: string, draftId: string, deferred: boolean },
    private fb: UntypedFormBuilder,
    private draftMonthlyReportSubmissionService: DraftMonthlyReportSubmissionService,
    private notificationService: NotificationService,
    private dialogRef: MatDialogRef<DraftMonthlyReportAppraisalComponent>
  ) { }

  ngOnInit(): void {
    this.draftStatus = this.data.deferred ? RequestStatus.ACCEPTED : RequestStatus.REJECTED;
    this.form = this.buildForm();
  }

  buildForm(): UntypedFormGroup {
    if (this.data.deferred) {
      return this.fb.group({
        'details': ['', [Validators.required]],
        'numberOfApprovedHours': ['', [Validators.required]],
      })
    } 
    else {
      return this.fb.group({
        'details': ['', [Validators.required]],
      })
    }
  }

  field(path: string) {
    return this.form.get(path)!;
  }

  fieldErrors(path: string) {
    return this.field(path)?.errors;
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    const draftMonthlyReportSubmissionAppraise = new DraftMonthlyReportSubmissionAppraise(
      this.draftStatus,
      this.field('details').value,
      this.data.deferred ? this.field('numberOfApprovedHours').value : null
    );
    this.draftMonthlyReportSubmissionService.appraiseDraftMonthlyReportSubmission(
      this.data.internshipId,
      this.data.monthlyReportId,
      this.data.draftId,
      draftMonthlyReportSubmissionAppraise
    )
    .pipe(first())
    .subscribe(
      draft => {
        this.notificationService.success('Rascunho de relatório mensal avaliado com sucesso!');
        this.dialogRef.close(draft);
      }
    )
  }
}
