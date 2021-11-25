import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DraftMonthlyReportSubmission } from 'src/app/core/models/draft-monthly-report-submission.model';
import { ReportStatus } from 'src/app/core/models/enums/report-status';
import { RequestStatus } from 'src/app/core/models/enums/request-status';
import { MonthlyReport } from 'src/app/core/models/monthly-report.model';

@Component({
  selector: 'app-draft-monthly-report-list',
  templateUrl: './draft-monthly-report-list.component.html',
  styleUrls: ['./draft-monthly-report-list.component.scss']
})
export class DraftMonthlyReportListComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { monthlyReport: MonthlyReport },
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.data.monthlyReport.draftMonthlyReportSubmissions.sort((a, b) => b.submissionDate.localeCompare(a.submissionDate));
  }

  handleDraftWasAccepted() {
    return this.data.monthlyReport.status === ReportStatus.FINAL_PENDING ? true : false;
  }
  
  handleCanSubmitDraft() {
    return this.data.monthlyReport.status === ReportStatus.DRAFT_PENDING ? true : false;
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

  openDraftReport(draft: DraftMonthlyReportSubmission) {
    window.open(draft.draftMonthlyReportUrl);
  }
}
