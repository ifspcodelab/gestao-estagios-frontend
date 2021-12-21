import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DraftMonthlyReportSubmission } from 'src/app/core/models/draft-monthly-report-submission.model';
import { ReportStatus } from 'src/app/core/models/enums/report-status';
import { RequestStatus } from 'src/app/core/models/enums/request-status';
import { MonthlyReport } from 'src/app/core/models/monthly-report.model';
import { DraftMonthlyReportAppraisalComponent } from '../draft-monthly-report-appraisal/draft-monthly-report-appraisal.component';

@Component({
  selector: 'app-draft-monthly-report-list',
  templateUrl: './draft-monthly-report-list.component.html',
  styleUrls: ['./draft-monthly-report-list.component.scss']
})
export class DraftMonthlyReportListComponent implements OnInit {
  acceptedDraft: DraftMonthlyReportSubmission;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { monthlyReport: MonthlyReport, internshipId: string },
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<DraftMonthlyReportListComponent>
  ) { }

  ngOnInit(): void {
    if (this.data.monthlyReport.draftMonthlyReportSubmissions) {
      this.data.monthlyReport.draftMonthlyReportSubmissions.sort((a, b) => b.submissionDate.localeCompare(a.submissionDate));
    }
  }

  handleDraftWasAccepted() {
    return this.data.monthlyReport.status === ReportStatus.FINAL_PENDING ||
    this.data.monthlyReport.status === ReportStatus.FINAL_SENT || 
    this.data.monthlyReport.status === ReportStatus.FINAL_ACCEPTED 
    ? true : false;
  }
  
  handleCanAppraiseDraft(draft: DraftMonthlyReportSubmission) {
    return draft.status === RequestStatus.PENDING ? true : false;
  }

  private getDialogConfig(deferred: boolean, draftId: string) {
    return {
      autoFocus: false,
      data: {
        deferred: deferred,
        internshipId: this.data.internshipId,
        monthlyReportId: this.data.monthlyReport.id,
        draftId: draftId
      }
    };
  }

  handleAppraiseDraft($event: Event, deferred: boolean, draftId: string) {
    $event.stopPropagation();
    this.dialog.open(DraftMonthlyReportAppraisalComponent, this.getDialogConfig(deferred, draftId))
    .afterClosed()
    .subscribe(result => {
      if (result) {
        if(result.status == RequestStatus.ACCEPTED) {
          this.data.monthlyReport.status = ReportStatus.FINAL_PENDING;
          this.data.monthlyReport.startDate = result.reportStartDate;
          this.data.monthlyReport.endDate = result.reportEndDate;
        }
        else {
          this.data.monthlyReport.status = ReportStatus.DRAFT_PENDING;
        }
        const draftFound = this.data.monthlyReport.draftMonthlyReportSubmissions.find(d => d.id == result.id);
        if (draftFound) {
          draftFound.status = result.status;
        }
      }
    });
  }

  formatSubmissionDate(submissionDate: string): string {
    return `${this.datePipe.transform(submissionDate, 'dd/MM/yyyy')}`;
  }

  formatStartEndDate(reportStartDate: string, reportEndDate: string) {
    return `${this.datePipe.transform(reportStartDate, 'dd/MM/yyyy')} - ${this.datePipe.transform(reportEndDate, 'dd/MM/yyyy')}`;
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

  openDraftReport(draft: DraftMonthlyReportSubmission) {
    window.open(draft.draftMonthlyReportUrl);
  }

  closeDialog() {
    this.dialogRef.close(this.data.monthlyReport);
  }
}
