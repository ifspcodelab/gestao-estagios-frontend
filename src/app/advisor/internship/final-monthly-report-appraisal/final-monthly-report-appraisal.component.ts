import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { finalize, first } from 'rxjs/operators';
import { RequestStatus } from 'src/app/core/models/enums/request-status';
import { FinalMonthlyReportSubmissionAppraise } from 'src/app/core/models/final-monthly-report-submission.model';
import { Parameter } from 'src/app/core/models/parameter.model';
import { FinalMonthlyReportSubmissionService } from 'src/app/core/services/final-monthly-report.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { MonthlyReportService } from 'src/app/core/services/monthly-report.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { ParameterService } from 'src/app/core/services/parameter.service';

@Component({
  selector: 'app-final-monthly-report-appraisal',
  templateUrl: './final-monthly-report-appraisal.component.html',
  styleUrls: ['./final-monthly-report-appraisal.component.scss']
})
export class FinalMonthlyReportAppraisalComponent implements OnInit {
  form: FormGroup;
  submitted: boolean;
  finalStatus: RequestStatus;
  fileName: string = 'Nenhum arquivo anexado.';
  formData: FormData = new FormData();
  loading: boolean = true;
  parameter: Parameter

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { internshipId: string, monthlyReportId: string, finalId: string, deferred: boolean },
    private fb: FormBuilder,
    private finalMonthlyReportSubmissionService: FinalMonthlyReportSubmissionService,
    private monthlyReportService: MonthlyReportService,
    private notificationService: NotificationService,
    private dialogRef: MatDialogRef<FinalMonthlyReportAppraisalComponent>,
    private parameterService: ParameterService,
    private loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    this.finalStatus = this.data.deferred ? RequestStatus.ACCEPTED : RequestStatus.REJECTED;
    this.loaderService.show();
    this.fetchParameters();
    this.form = this.buildForm();
  }

  fetchParameters() {
    this.parameterService.getParameters()
      .pipe(
        first(),
        finalize(() => {
          this.loaderService.hide();
          this.loading = false;
        })
      )
      .subscribe(
        parameter => {
          this.parameter = parameter
        }
      )
  }

  buildForm(): FormGroup {
    if (this.data.deferred) {
      return this.fb.group({
        'details': ['', [Validators.required]],
        'file': ['']
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

  onFileSelected($event: any) {
    const file = $event.target.files[0];
    if (file) {
      if(file.size > this.parameter.monthlyReportFileSizeMegabytes * 1048576) {
        this.notificationService.error(`Tamanho do arquivo excede ${this.parameter.monthlyReportFileSizeMegabytes} MB!`)
        return;
      }
      this.fileName = file.name;
      this.formData.append('file', file);
    }
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    const finalMonthlyReportSubmissionAppraise = new FinalMonthlyReportSubmissionAppraise(
      this.field('details').value,
      this.finalStatus
    );
    this.finalMonthlyReportSubmissionService.appraiseFinalMonthlyReportSubmission(
      this.data.internshipId,
      this.data.monthlyReportId,
      this.data.finalId,
      finalMonthlyReportSubmissionAppraise
    )
    .pipe(first())
    .subscribe(
      final => {
        if (this.formData.has('file')) {
          this.monthlyReportService.putMonthlyReport(this.data.internshipId, this.data.monthlyReportId, this.formData).pipe()
          .subscribe()
        }
        this.notificationService.success('Relatório mensal avaliado com sucesso!');
        this.dialogRef.close(final);
      }
    )
  }
}
