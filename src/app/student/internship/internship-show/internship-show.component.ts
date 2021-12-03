import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
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
import { RealizationTermService } from 'src/app/core/services/realization-term.service';
import { RealizationTermUpdate } from 'src/app/core/models/realization-term.model';

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
  dataRealizationTerm: FormData;
  parameter: Parameter;
  deferredActivityPlan: ActivityPlan | undefined;
  displayedColumns: string[] = ['month', 'draft', 'report'];
  monthlyReports: MonthlyReport[];
  isExtraSmall: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.XSmall);
  formRealizationTerm: FormGroup;
  internshipStartDate: string;
  internshipEndDate: string;

  constructor(
    private fb: FormBuilder,
    private fbrt: FormBuilder,
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private internshipService: InternshipService,
    private notificationService: NotificationService,
    private router: Router,
    private activityPlanService: ActivityPlanService,
    private realizationTermService: RealizationTermService,
    private parameterService: ParameterService,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    
    const currentDate = new Date();
    this.minDate = new Date(currentDate.setDate(currentDate.getDate() + 1));

    if (this.id) {
      this.loaderService.show();
      this.fetchParameters();
      this.fetchInternship(this.id);
    }

    this.formRealizationTerm = this.buildFormRealizationTerm();
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
          const deferredActivityPlans = this.internship.activityPlans
            .filter(p => p.status === RequestStatus.ACCEPTED)
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          if (deferredActivityPlans.length == 1) {
            this.deferredActivityPlan = deferredActivityPlans[0];
            this.internshipStartDate = this.deferredActivityPlan.internshipStartDate;
            this.internshipEndDate = this.deferredActivityPlan.internshipEndDate;
          } else {
            this.deferredActivityPlan = deferredActivityPlans[0];
            this.internshipStartDate = this.deferredActivityPlan.internshipStartDate;
            this.internshipEndDate = deferredActivityPlans[deferredActivityPlans.length - 1].internshipEndDate;
          }
          this.monthlyReports = internship.monthlyReports.sort((a, b) => a.month.toString().localeCompare(b.month.toString()));
          this.form = this.buildForm();
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

    let companyName = null;
    if (!this.handleInternshipIsInProgress()) {
      companyName = this.form.get('companyName')!.value;
    }
    const startDate = new Date(this.form.get('internshipStartDate')!.value).toISOString();
    const endDate = new Date(this.form.get('internshipEndDate')!.value).toISOString();
    const activityPlanUpdate: ActivityPlanUpdate = new ActivityPlanUpdate(
      companyName,
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
                if (this.internship.status !== InternshipStatus.IN_PROGRESS) {
                  this.internship.status = InternshipStatus.ACTIVITY_PLAN_SENT;
                }
                this.notificationService.success('Plano de atividades enviado com sucesso!');
              }
            )
        }
      )
  }

  public onSubmitRealizationTerm() {
    this.submitted = true;

    if (this.formRealizationTerm.invalid) {
      return;
    }

    const startDate = new Date(this.formRealizationTerm.get('internshipStartDate')!.value).toISOString();
    const endDate = new Date(this.formRealizationTerm.get('internshipEndDate')!.value).toISOString();
    const realizationTermUpdate: RealizationTermUpdate = new RealizationTermUpdate(
      startDate,
      endDate
    );
    this.realizationTermService.create(this.id!, this.data)
      .pipe(
        first()
      )
      .subscribe(
        realizationTerm => {
          this.realizationTermService.update(this.id!, realizationTerm.id, realizationTermUpdate)
            .pipe()
            .subscribe(
              realizationTerm => {
                this.internship.realizationTerms.push(realizationTerm);
                this.notificationService.success('Termo de Realização enviado com sucesso!');
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

  buildFormRealizationTerm(): FormGroup {
    return this.fbrt.group({
      internshipStartDate: ['',
        [Validators.required]
      ],
      internshipEndDate: ['',
        [Validators.required]
      ],
      file: ['',
        [Validators.required]
      ],
    });
  }

  buildForm(): FormGroup {
    if (!this.handleInternshipIsInProgress()) {
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
    } else {
      return this.fb.group({
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
    for (const activityPlan of this.internship.activityPlans) {
      if (activityPlan.status === RequestStatus.PENDING) {
        return false;
      }
    }
    return true;
  }

  handleCanSendRealizationTerm(): boolean {
    const monthlyReportsUntilActualMonth = this.monthlyReports.filter(r => new Date(r.month) <= new Date(new Date().setDate(1)));
    if (this.internship.monthlyReports.length == 0) {
      return false;
    }
    for (const realizationTerm of this.internship.realizationTerms) {
      if (realizationTerm.status === RequestStatus.PENDING || realizationTerm.status === RequestStatus.ACCEPTED) {
        return false;
      }
    }
    for (const report of monthlyReportsUntilActualMonth) {
      if (report.status !== ReportStatus.FINAL_ACCEPTED) {
        return false;
      }
    }
    return true;
  }

  handleRequestStatus(status: RequestStatus): string {
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

  openRealizationTerm(realizationTermUrl: string) {
    window.open(realizationTermUrl);
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

  formatDateRealizationTerm(realizationTermCreatedAt: Date) : string {
    return `${this.datePipe.transform(realizationTermCreatedAt, 'dd/MM/yyyy')}`
  }
}