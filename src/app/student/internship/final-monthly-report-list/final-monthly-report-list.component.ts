import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { finalize, first } from 'rxjs/operators';
import { InternshipStatus } from 'src/app/core/models/enums/InternshipStatus';
import { ReportStatus } from 'src/app/core/models/enums/report-status';
import { RequestStatus } from 'src/app/core/models/enums/request-status';
import { FinalMonthlyReportSubmission } from 'src/app/core/models/final-monthly-report-submission.model';
import { Internship } from 'src/app/core/models/internship.model';
import { MonthlyReport } from 'src/app/core/models/monthly-report.model';
import { Parameter } from 'src/app/core/models/parameter.model';
import { FinalMonthlyReportSubmissionService } from 'src/app/core/services/final-monthly-report.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { ParameterService } from 'src/app/core/services/parameter.service';

@Component({
  selector: 'app-final-monthly-report-list',
  templateUrl: './final-monthly-report-list.component.html',
  styleUrls: ['./final-monthly-report-list.component.scss']
})
export class FinalMonthlyReportListComponent implements OnInit {
  loading: boolean = true;
  form: UntypedFormGroup;
  submitted: boolean = false;
  fileName: string = "Nenhum arquivo anexado.";
  formData: FormData;
  parameter: Parameter;
  acceptedReport: FinalMonthlyReportSubmission;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { monthlyReport: MonthlyReport, internship: Internship },
    private datePipe: DatePipe,
    private fb: UntypedFormBuilder,
    private parameterService: ParameterService,
    private loaderService: LoaderService,
    private notificationService: NotificationService,
    private finalMonthlyReportSubmissionService: FinalMonthlyReportSubmissionService
  ) { }

  ngOnInit(): void {
    this.loaderService.show();
    this.data.monthlyReport.finalMonthlyReportSubmissions.sort((a, b) => b.submissionDate.localeCompare(a.submissionDate));
    this.fetchParameters();
    this.acceptedReport = this.data.monthlyReport.finalMonthlyReportSubmissions.find(r => r.status === RequestStatus.ACCEPTED)!;
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

  buildForm(): UntypedFormGroup {
    return this.fb.group({
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
      this.submitted = false;
      return;
    }

    this.finalMonthlyReportSubmissionService.postFinalMonthlyReportSubmission(
      this.data.internship.id, 
      this.data.monthlyReport.id, 
      this.formData
    )
      .pipe(first())
      .subscribe(
        final => {
          this.data.monthlyReport.finalMonthlyReportSubmissions.push(final);
          this.data.monthlyReport.status = ReportStatus.FINAL_SENT;
          this.notificationService.success('Relatório mensal enviado com sucesso!');
          this.submitted = false;
        }
      )
  }

  handleFinalWasAccepted() {
    return this.data.monthlyReport.status === ReportStatus.FINAL_ACCEPTED ? true : false;
  }
  
  handleCanSubmitFinal() {
    if (this.data.internship.status === InternshipStatus.FINISHED || this.data.internship.status === InternshipStatus.REALIZATION_TERM_ACCEPTED) {
      return false;
    }
    return this.data.monthlyReport.status === ReportStatus.FINAL_PENDING ? true : false;
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

  openFinalReport(final: FinalMonthlyReportSubmission) {
    window.open(final.finalMonthlyReportUrl);
  }
}
