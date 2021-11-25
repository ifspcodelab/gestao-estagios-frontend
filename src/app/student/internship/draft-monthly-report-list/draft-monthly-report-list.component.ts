import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { finalize, first } from 'rxjs/operators';
import { DraftMonthlyReportSubmission, DraftMonthlyReportSubmissionUpdate } from 'src/app/core/models/draft-monthly-report-submission.model';
import { ReportStatus } from 'src/app/core/models/enums/report-status';
import { RequestStatus } from 'src/app/core/models/enums/request-status';
import { MonthlyReport } from 'src/app/core/models/monthly-report.model';
import { Parameter } from 'src/app/core/models/parameter.model';
import { DraftMonthlyReportSubmissionService } from 'src/app/core/services/draft-monthly-report.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { ParameterService } from 'src/app/core/services/parameter.service';

@Component({
  selector: 'app-draft-monthly-report-list',
  templateUrl: './draft-monthly-report-list.component.html',
  styleUrls: ['./draft-monthly-report-list.component.scss']
})
export class DraftMonthlyReportListComponent implements OnInit {
  loading: boolean = true;
  form: FormGroup;
  submitted: boolean = false;
  fileName: string = "Nenhum arquivo anexado.";
  formData: FormData;
  parameter: Parameter;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { monthlyReport: MonthlyReport, internshipId: string },
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private parameterService: ParameterService,
    private loaderService: LoaderService,
    private notificationService: NotificationService,
    private draftMonthlyReportSubmissionService: DraftMonthlyReportSubmissionService
  ) { }

  ngOnInit(): void {
    this.loaderService.show();
    this.data.monthlyReport.draftMonthlyReportSubmissions.sort((a, b) => b.submissionDate.localeCompare(a.submissionDate));
    this.fetchParameters();
    this.form = this.buildForm();
  }

  fetchParameters() {
    this.parameterService.getParameters()
      .pipe(
        first(),
        finalize(() => {
          this.loading = false;
          this.loaderService.hide();
        })
      )
      .subscribe(
        parameter => {
          this.parameter = parameter;
        },error => {
          if(error.status >= 400 || error.status <= 499) {
            this.notificationService.error(`Parâmetros não encontrados!`);
          }
        }
      )
  }

  buildForm(): FormGroup {
    return this.fb.group({
      reportStartDate: ['',
        [Validators.required]
      ],
      reportEndDate: ['',
        [Validators.required]
      ],
      file: ['',
        [Validators.required]
      ],
    });
  }

  field(path: string) {
    return this.form.get(path)!;
  }

  fieldErrors(path: string) {
    return this.field(path)?.errors;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if(file.size > this.parameter.monthlyReportFileSizeMegabytes * 1048576) {
        this.notificationService.error(`Tamanho do arquivo excede ${this.parameter.monthlyReportFileSizeMegabytes} MB!`)
        return;
      }
      this.fileName = file.name;
      this.formData = new FormData();
      this.formData.append('file', file);
    }
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    const reportStartDate = new Date(this.form.get('reportStartDate')!.value).toISOString();
    const reportEndDate = new Date(this.form.get('reportEndDate')!.value).toISOString();
    const draftMonthlyReportSubmissionUpdate = new DraftMonthlyReportSubmissionUpdate(
      reportStartDate,
      reportEndDate
    );

    this.draftMonthlyReportSubmissionService.postDraftMonthlyReportSubmission(
      this.data.internshipId, 
      this.data.monthlyReport.id, 
      this.formData
    )
      .pipe(first())
      .subscribe(
        draft => {
          this.draftMonthlyReportSubmissionService.putDraftMonthlyReportSubmission(
            this.data.internshipId,
            this.data.monthlyReport.id,
            draft.id,
            draftMonthlyReportSubmissionUpdate
          )
          .pipe()
          .subscribe(draft => {
            this.data.monthlyReport.draftMonthlyReportSubmissions.push(draft);
            this.data.monthlyReport.status = ReportStatus.DRAFT_SENT;
            this.notificationService.success('Rascunho de relatório mensal enviado com sucesso!');
          })
        }
      )
  }

  handleDraftWasAccepted() {
    return this.data.monthlyReport.status === ReportStatus.FINAL_PENDING ||
    this.data.monthlyReport.status === ReportStatus.FINAL_SENT || 
    this.data.monthlyReport.status === ReportStatus.FINAL_ACCEPTED 
    ? true : false;
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
