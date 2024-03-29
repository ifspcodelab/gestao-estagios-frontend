import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { finalize, first } from 'rxjs/operators';
import { ActivityPlan } from 'src/app/core/models/activity-plan.model';
import { InternshipType } from 'src/app/core/models/enums/internship-type';
import { InternshipStatus } from 'src/app/core/models/enums/InternshipStatus';
import { RequestStatus } from 'src/app/core/models/enums/request-status';
import { Internship } from 'src/app/core/models/internship.model';
import { InternshipService } from 'src/app/core/services/internship.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { ActivityPlanAppraisalComponent } from '../activity-plan-appraisal/activity-plan-appraisal.component';
import { DatePipe } from "@angular/common";
import { MonthlyReport } from 'src/app/core/models/monthly-report.model';
import { ReportStatus } from 'src/app/core/models/enums/report-status';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { DraftMonthlyReportListComponent } from '../draft-monthly-report-list/draft-monthly-report-list.component';
import { FinalMonthlyReportListComponent } from '../final-monthly-report-list/final-monthly-report-list.component';
import { RealizationTermAppraisalComponent } from '../realization-term-appraisal/realization-term-appraisal.component';
import { DispatchComponent } from "../dispatch/dispatch.component";
import { Parameter } from "../../../core/models/parameter.model";
import { ParameterService } from "../../../core/services/parameter.service";
import { FinalDocumentationComponent } from '../final-documentation/final-documentation.component';
import { DispatchService } from 'src/app/core/services/dispatch.service';
import { RealizationTerm } from 'src/app/core/models/realization-term.model';

@Component({
  selector: 'app-internship-show',
  templateUrl: './internship-show.component.html',
  styleUrls: ['./internship-show.component.scss']
})
export class InternshipShowComponent implements OnInit {
  internship: Internship;
  deferredActivityPlan: ActivityPlan | undefined;
  id: string | null;
  loading: boolean = true;
  displayedColumns: string[] = ['month', 'draft', 'report'];
  monthlyReports: MonthlyReport[];
  isExtraSmall: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.XSmall);
  internshipStartDate: string;
  internshipEndDate: string;
  parameter: Parameter;

  constructor(
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private internshipService: InternshipService,
    private notificationService: NotificationService,
    private router: Router,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private breakpointObserver: BreakpointObserver,
    private parameterService: ParameterService,
    private dispatchService: DispatchService,
  ) { }

  openInitialDispatchDialog($event: Event) {
    $event.stopPropagation();

    this.loaderService.show();
    this.dispatchService.getInitialDispatch(this.internship.id, this.deferredActivityPlan!.id)
      .pipe(
        first(),
        finalize(() => {
          this.loaderService.hide();
          this.loading = false;
        })
      )
      .subscribe(
        dispatch => {
          this.dialog.open(DispatchComponent, { data: { dispatch: dispatch, title: 'HTML Despacho Inicial' } })
        }
      )
  }

  openFinalDispatchDialog($event: Event) {
    $event.stopPropagation();

    this.loaderService.show();
    this.dispatchService.getFinalDispatch(this.internship.id)
      .pipe(
        first(),
        finalize(() => {
          this.loaderService.hide();
          this.loading = false;
        })
      )
      .subscribe(
        dispatch => {
          this.dialog.open(DispatchComponent, { data: { dispatch: dispatch, title: 'HTML Despacho Final' } })
        }
      )
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');

    if (this.id) {
      this.loaderService.show();
      this.fetchParameters();
      this.fetchInternship(this.id);
    }
  }

  fetchParameters() {
    this.parameterService.getParameters()
      .pipe(
        first()
      )
      .subscribe(
        parameter => {
          this.parameter = parameter;
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
          } else if (deferredActivityPlans.length > 1) {
            this.deferredActivityPlan = deferredActivityPlans[0];
            this.internshipStartDate = this.deferredActivityPlan.internshipStartDate;
            this.internshipEndDate = deferredActivityPlans[deferredActivityPlans.length - 1].internshipEndDate;
          }
          this.monthlyReports = internship.monthlyReports.sort((a, b) => a.month.toString().localeCompare(b.month.toString()));
        },
        error => {
          if(error.status >= 400 || error.status <= 499) {
            this.notificationService.error(`Estágio não encontrado com id ${this.id}`);
            this.router.navigate(['advisor/internship']);
          }
        }
      )
  }

  handleType(internshipType: InternshipType): string {
    return InternshipType.toString(internshipType)
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

  openRealizationTerm(realizationTermUrl: string) {
    window.open(realizationTermUrl);
  }

  private getDialogConfig(deferred: boolean, activityPlanId: string) {
    return {
      autoFocus: true,
      data: {
        deferred: deferred,
        activityPlanId: activityPlanId,
        internshipId: this.id
      }
    };
  }

  private getDialogConfigRealizationTerm(deferred: boolean, realizationTermId: string) {
    return {
      autoFocus: true,
      data: {
        deferred: deferred,
        realizationTermId: realizationTermId,
        internshipId: this.id
      }
    };
  }
  
  handleCanCopyDispatch(activityPlan: ActivityPlan) {
    return activityPlan.status === RequestStatus.ACCEPTED
  }

  private getDialogFinalDocumentation() {
    return {
      autoFocus: false,
      data: {
        internship: this.internship
      }
    };
  }

  handleCanAppraiseActivityPlan(activityPlan: ActivityPlan) {
    if (activityPlan.status === RequestStatus.PENDING) {
      return true;
    }
    return false;
  }

  handleInternshipIsInProgress() {
    if (this.internship.status === InternshipStatus.IN_PROGRESS || this.internship.status === InternshipStatus.REALIZATION_TERM_ACCEPTED ||
      this.internship.status === InternshipStatus.FINISHED) {
      return true
    }
    return false;
  }

  handleAppraiseActivityPlan($event: Event, deferred: boolean, activityPlanId: string) {
    $event.stopPropagation();
    this.dialog.open(ActivityPlanAppraisalComponent, this.getDialogConfig(deferred, activityPlanId))
      .afterClosed()
      .subscribe((result: ActivityPlan) => {
        if (result) {
          this.deferredActivityPlan = result;
          if(result.status == RequestStatus.ACCEPTED) {
            if (this.internship.status === InternshipStatus.ACTIVITY_PLAN_SENT) {
              this.internshipStartDate = result.internshipStartDate;
            }
            this.monthlyReports.length = 0;
            this.internship.internshipType = result.internship.internshipType;
            this.internship.status = InternshipStatus.IN_PROGRESS;
            this.internshipEndDate = result.internshipEndDate;
            this.monthlyReports = result.internship.monthlyReports.sort((a, b) => a.month.toString().localeCompare(b.month.toString()));
          }
          const activityPlanFound = this.internship.activityPlans.find(p => p.id == result.id);
          if (activityPlanFound) {
            activityPlanFound.status = result.status;
          }
        }
      });
  }

  handleAppraiseRealizationTerm($event: Event, deferred: boolean, realizationTermId: string) {
    $event.stopPropagation();
    this.dialog.open(RealizationTermAppraisalComponent, this.getDialogConfigRealizationTerm(deferred, realizationTermId))
      .afterClosed()
      .subscribe((result: RealizationTerm) => {
        if(result) {
          const realizationTermFound = this.internship.realizationTerms.find(r => r.id == result.id);
          if (result.status === RequestStatus.ACCEPTED) {
            this.internship.status = InternshipStatus.REALIZATION_TERM_ACCEPTED;
          }
          if (realizationTermFound) {
            realizationTermFound.status = result.status;
          }
        }
      });
  }

  formatDate(internshipStartDate: string, internshipEndDate: string) : string {
    return `${this.datePipe.transform(internshipStartDate, 'dd/MM/yyyy')} - ${this.datePipe.transform(internshipEndDate, 'dd/MM/yyyy')}`
  }

  handleCantAppraiseDraft(reportMonth: Date) {
    return new Date(reportMonth) > new Date() ? true : false;
  }

  handleCantAppraiseReport(report: MonthlyReport) {
    return report.status === ReportStatus.DRAFT_PENDING ||
      report.status === ReportStatus.DRAFT_SENT
      ? true : false;
  }

  handleDraftReportStatus(report: MonthlyReport) {
    if (report.status === ReportStatus.DRAFT_PENDING && this.handleCantAppraiseDraft(report.month)) {
      return 'Não Liberado';
    }
    if (report.status === ReportStatus.DRAFT_PENDING) {
      return 'Pendente';
    }
    else if (report.status === ReportStatus.DRAFT_SENT) {
      return 'Avaliar';
    }
    return 'Deferido';
  }

  handleReportStatus(report: MonthlyReport) {
    if (this.handleCantAppraiseReport(report)) {
      return "Não Liberado";
    }
    if (!this.handleCantAppraiseReport(report) && report.status === ReportStatus.FINAL_PENDING 
    ) {
      return 'Pendente';
    }
    else if (report.status === ReportStatus.FINAL_SENT) {
      return 'Avaliar';
    }
    return 'Deferido';
  }

  private getReportDialogConfig(monthlyReport: MonthlyReport) {
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

  private handleResponsiveDialog(dialog: MatDialogRef<any>, report: MonthlyReport) {
    const smallDialogSubscription = this.isExtraSmall.subscribe(result => {
      if (result.matches) {
        dialog.updateSize('100%', '100%');
        dialog.addPanelClass('dialog-center');
      } else {
        dialog.updateSize('70%', '60%');
        dialog.removePanelClass('dialog-center');
      }
    });

    dialog.afterClosed().subscribe(result => {
      if (result) {
        report.status = result.status;
      }
      smallDialogSubscription.unsubscribe();
    });
  }

  openDraftDialog(report: MonthlyReport) {
    const dialog = this.dialog.open(DraftMonthlyReportListComponent, this.getReportDialogConfig(report));
    this.handleResponsiveDialog(dialog, report);
  }

  openFinalDialog(report: MonthlyReport) {
    const dialog = this.dialog.open(FinalMonthlyReportListComponent, this.getReportDialogConfig(report));
    this.handleResponsiveDialog(dialog, report);
  }

  handleDefaultTab() {
    if (this.internship.status === InternshipStatus.IN_PROGRESS) {
      return 1;
    }
    if (this.internship.status === InternshipStatus.REALIZATION_TERM_ACCEPTED || this.internship.status === InternshipStatus.FINISHED) {
      return 2;
    }
    return 0;
  }

  formatDateRealizationTerm(createdAt: Date) : string {
    return `${this.datePipe.transform(createdAt, 'dd/MM/yyyy')}`
  }

  handleCanConsolidateDocumentation() {
    return this.internship.status === InternshipStatus.REALIZATION_TERM_ACCEPTED || this.internship.status === InternshipStatus.FINISHED ? true : false;
  }

  consolidateDocumentation($event: Event) {
    $event.stopPropagation();
    this.dialog.open(FinalDocumentationComponent, this.getDialogFinalDocumentation())
      .afterClosed()
      .subscribe((result: RealizationTerm) => {
        if(result) {
          this.internship.status = InternshipStatus.FINISHED;
        }
      });
  }

  isInternshipFinished() {
    return this.internship.status === InternshipStatus.FINISHED;
  }
}