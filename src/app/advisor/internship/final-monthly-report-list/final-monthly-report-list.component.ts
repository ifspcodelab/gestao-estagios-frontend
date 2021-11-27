import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DraftMonthlyReportSubmission } from 'src/app/core/models/draft-monthly-report-submission.model';
import { ReportStatus } from 'src/app/core/models/enums/report-status';
import { RequestStatus } from 'src/app/core/models/enums/request-status';
import { FinalMonthlyReportSubmission } from 'src/app/core/models/final-monthly-report-submission.model';
import { MonthlyReport } from 'src/app/core/models/monthly-report.model';
import { DraftMonthlyReportAppraisalComponent } from '../draft-monthly-report-appraisal/draft-monthly-report-appraisal.component';
import { FinalMonthlyReportAppraisalComponent } from '../final-monthly-report-appraisal/final-monthly-report-appraisal.component';

@Component({
  selector: 'app-final-monthly-report-list',
  templateUrl: './final-monthly-report-list.component.html',
  styleUrls: ['./final-monthly-report-list.component.scss']
})
export class FinalMonthlyReportListComponent implements OnInit {
  acceptedDraft: DraftMonthlyReportSubmission;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { monthlyReport: MonthlyReport, internshipId: string },
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<FinalMonthlyReportListComponent>
  ) { }

  ngOnInit(): void {
    this.data.monthlyReport.draftMonthlyReportSubmissions.sort((a, b) => b.submissionDate.localeCompare(a.submissionDate));
  }

  handleFinalWasAccepted() {
    return this.data.monthlyReport.status === ReportStatus.FINAL_ACCEPTED ? true : false;
  }
  
  handleCanAppraiseFinal(draft: FinalMonthlyReportSubmission) {
    return draft.status === RequestStatus.PENDING ? true : false;
  }

  private getDialogConfig(deferred: boolean, finalId: string) {
    return {
      autoFocus: false,
      data: {
        deferred: deferred,
        internshipId: this.data.internshipId,
        monthlyReportId: this.data.monthlyReport.id,
        finalId: finalId
      }
    };
  }

  handleAppraiseFinal($event: Event, deferred: boolean, finalId: string) {
    $event.stopPropagation();
    this.dialog.open(FinalMonthlyReportAppraisalComponent, this.getDialogConfig(deferred, finalId))
    .afterClosed()
    .subscribe(result => {
      if (result) {
        if(result.status == RequestStatus.ACCEPTED) {
          this.data.monthlyReport.status = ReportStatus.FINAL_ACCEPTED;
        }
        else {
          this.data.monthlyReport.status = ReportStatus.FINAL_PENDING;
        }
        const finalFound = this.data.monthlyReport.finalMonthlyReportSubmissions.find(d => d.id == result.id);
        if (finalFound) {
          finalFound.status = result.status;
        }
      }
    });
  }

  formatSubmissionDate(submissionDate: string): string {
    return `${this.datePipe.transform(submissionDate, 'dd/MM/yyyy')}`;
  }

  handleStatus(status: RequestStatus) {
    if (status === RequestStatus.PENDING) {
      return 'PENDENTE';
    }
    else if (status === RequestStatus.ACCEPTED) {
      return 'DEFERIDO';
    }
    return 'INDEFERIDO'
  }

  openFinalReport(draft: FinalMonthlyReportSubmission) {
    window.open(draft.finalMonthlyReportUrl);
  }

  closeDialog() {
    this.dialogRef.close(this.data.monthlyReport);
  }
}
