import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DateAdapter } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, first } from 'rxjs/operators';
import { ActivityPlan, ActivityPlanUpdate } from 'src/app/core/models/activity-plan.model';
import { InternshipStatus } from 'src/app/core/models/enums/InternshipStatus';
import { RequestStatus } from 'src/app/core/models/enums/request-status';
import { Internship } from 'src/app/core/models/internship.model';
import { ActivityPlanService } from 'src/app/core/services/activity-plan.service';
import { InternshipService } from 'src/app/core/services/internship.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { AppValidators } from "../../../core/validators/app-validators";
import {ParameterService} from "../../../core/services/parameter.service";
import {Parameter} from "../../../core/models/parameter.model";
import {DatePipe} from "@angular/common";
import { MonthlyReport } from 'src/app/core/models/monthly-report.model';
import { ReportStatus } from 'src/app/core/models/enums/report-status';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DraftMonthlyReportListComponent } from '../draft-monthly-report-list/draft-monthly-report-list.component';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { FinalMonthlyReportListComponent } from '../final-monthly-report-list/final-monthly-report-list.component';

@Component({
  selector: 'app-internship-show',
  templateUrl: './internship-show.component.html',
  styleUrls: ['./internship-show.component.scss']
})
export class InternshipShowComponent implements OnInit {
  internship: Internship;
  id: string | null;
  loading: boolean = true;
  form: FormGroup;
  submitted = false;
  minDate: Date;
  maxDate: Date;
  fileName: string = "Nenhum arquivo anexado.";
  data: FormData;
  parameter: Parameter;
  deferredActivityPlan: ActivityPlan | undefined;
  displayedColumns: string[] = ['month', 'draft', 'report'];
  monthlyReports: MonthlyReport[];
  isExtraSmall: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.XSmall);

  constructor(
    private fb: FormBuilder,
    private adapter: DateAdapter<any>,
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private internshipService: InternshipService,
    private notificationService: NotificationService,
    private router: Router,
    private activityPlanService: ActivityPlanService,
    private parameterService: ParameterService,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    
    this.adapter.setLocale('pt-br');
    const currentDate = new Date();
    this.minDate = new Date(currentDate.setDate(currentDate.getDate() + 1));

    if (this.id) {
      this.loaderService.show();
      this.fetchParameters();
      this.fetchInternship(this.id);
    }

    this.form = this.buildForm();
  }

  fetchParameters() {
    this.parameterService.getParameters()
      .pipe(
        first(),
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

  fetchInternship(internshipId: string) {
    this.internshipService.getById(internshipId)
      .pipe(
        first(),
        finalize(() => {
          this.loaderService.hide();
          this.loading = false;
        })
      )
      .subscribe (
        internship => {
          this.internship = internship;
          this.deferredActivityPlan = this.internship.activityPlans.find(p => p.status === RequestStatus.ACCEPTED);
          this.monthlyReports = internship.monthlyReports.sort((a, b) => a.month.toString().localeCompare(b.month.toString()));
        },
        error => {
          if(error.status >= 400 || error.status <= 499) {
            this.notificationService.error(`Estágio não encontrado com id ${this.id}`);
            this.router.navigate(['student/internship']);
          }
        }
      )
  }

  handleInternshipIsInProgress() {
    if (this.internship.status === InternshipStatus.IN_PROGRESS) {
      return true
    }
    return false;
  }

  public onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    const startDate = new Date(this.form.get('internshipStartDate')!.value).toISOString();
    const endDate = new Date(this.form.get('internshipEndDate')!.value).toISOString();
    const activityPlanUpdate: ActivityPlanUpdate = new ActivityPlanUpdate(
      this.form.get('companyName')!.value,
      startDate,
      endDate
    );
    this.activityPlanService.create(this.id!, this.data)
      .pipe(
        first()
      )
      .subscribe(
        activityPlan => {
          this.activityPlanService.update(this.id!, activityPlan.id, activityPlanUpdate)
            .pipe()
            .subscribe(
              activityPlan => {
                this.internship.activityPlans.push(activityPlan);
                this.internship.status = InternshipStatus.ACTIVITY_PLAN_SENT;
                this.notificationService.success('Plano de atividades enviado com sucesso!');
              }
            )
        }
      )
  }

  field(path: string) {
    return this.form.get(path)!;
  }

  fieldErrors(path: string) {
    return this.field(path)?.errors;
  }

  buildForm(): FormGroup {
    return this.fb.group({
      companyName: ['',
        [Validators.required, AppValidators.notBlank]
      ],
      internshipStartDate: ['',
        [Validators.required]
      ],
      internshipEndDate: [{value: '', disabled: true },
        [Validators.required]
      ],
      file: ['',
        [Validators.required]
      ],
    });
  }

  getLimitDate() {
    this.form.get('internshipEndDate')!.setValue('');
    const selectedDate = new Date(this.form.get('internshipStartDate')!.value);
    this.maxDate = new Date(selectedDate.setDate(selectedDate.getDate() + 365));
    this.form.get('internshipEndDate')!.enable();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if(this.ValidateSize(file)) {
        return;
      }
      this.fileName = file.name;
      this.data = new FormData();
      this.data.append('file', file);
    }
  }

  ValidateSize(file: any): boolean {
    if (file.size > this.parameter.activityPlanFileSizeMegabytes * 1048576) {
      this.notificationService.success(`Arquivo maior que ${this.parameter.activityPlanFileSizeMegabytes}MB!`);
      return true;
    }
    return false;
  }

  handleCanSendActivityPlan(): boolean {
    if (this.internship.status === InternshipStatus.ACTIVITY_PLAN_PENDING) {
      return true;
    }
    return false
  }

  handleActivityPlanStatus(status: RequestStatus): string {
    if (status === RequestStatus.PENDING) {
      return 'AGUARDANDO AVALIAÇÃO';
    }
    else if (status === RequestStatus.ACCEPTED) {
      return 'DEFERIDO';
    }
    else {
      return 'INDEFERIDO';
    }
  }

  openActivityPlan(activityPlan: ActivityPlan) {
    window.open(activityPlan.activityPlanUrl);
  }

  formatDate(internshipStartDate: string, internshipEndDate: string) : string {
    return `${this.datePipe.transform(internshipStartDate, 'dd/MM/yyyy')} - ${this.datePipe.transform(internshipEndDate, 'dd/MM/yyyy')}`
  }

  handleDefaultTab() {
    if (this.internship.status === InternshipStatus.IN_PROGRESS) {
      return 1;
    }
    return 0;
  }

  handleCantSendDraft(reportMonth: Date) {
    return new Date(reportMonth) > new Date() ? true : false;
  }

  handleCantSendReport(report: MonthlyReport) {
    return report.status === ReportStatus.DRAFT_PENDING ||
      report.status === ReportStatus.DRAFT_SENT
      ? true : false;
  }

  handleDraftReportStatus(report: MonthlyReport): string {
    if (report.status === ReportStatus.DRAFT_PENDING && this.handleCantSendDraft(report.month)) {
      return 'Não liberado';
    }
    else if (report.status === ReportStatus.DRAFT_PENDING) {
      return 'Enviar';
    }
    else if (report.status === ReportStatus.DRAFT_SENT && report.draftSubmittedOnDeadline) {
      return 'Enviado';
    }
    else if (report.status === ReportStatus.DRAFT_SENT) {
      return 'Enviado fora do prazo';
    }
    else {
      return 'Deferido';
    }
  }

  handleReportStatus(report: MonthlyReport): string {
    if (this.handleCantSendReport(report)) {
      return 'Não liberado';
    }
    else if (!this.handleCantSendReport(report) && report.status !== ReportStatus.FINAL_SENT && report.status !== ReportStatus.FINAL_ACCEPTED) {
      return 'Enviar';
    }
    else if (report.status === ReportStatus.FINAL_SENT) {
      return 'Enviado';
    }
    else {
      return 'Deferido';
    }
  }

  private getDialogConfig(monthlyReport: MonthlyReport) {
    return {
      width: '70%',
      height: '70%',
      maxWidth: '100vw',
      maxHeight: '100vh',
      autoFocus: false,
      data: {
        internshipId: this.id,
        monthlyReport: monthlyReport,
      }
    }
  }

  private handleResponsiveDialog(dialog: MatDialogRef<any>) {
    const smallDialogSubscription = this.isExtraSmall.subscribe(result => {
      if (result.matches) {
        dialog.updateSize('100%', '100%');
        dialog.addPanelClass('dialog-center');
      } else {
        dialog.updateSize('70%', '60%');
        dialog.removePanelClass('dialog-center');
      }
    });    
    dialog.afterClosed().subscribe(_ => {
      smallDialogSubscription.unsubscribe();
    });
  }

  openDraftDialog(monthlyReport: MonthlyReport) {
    const dialog = this.dialog.open(DraftMonthlyReportListComponent, this.getDialogConfig(monthlyReport));
    this.handleResponsiveDialog(dialog);
  }

  openFinalDialog(monthlyReport: MonthlyReport) {
    const dialog = this.dialog.open(FinalMonthlyReportListComponent, this.getDialogConfig(monthlyReport));
    this.handleResponsiveDialog(dialog);
  }
}
