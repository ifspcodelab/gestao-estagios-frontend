import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, first } from 'rxjs/operators';
import { ActivityPlan, ActivityPlanUpdate } from 'src/app/core/models/activity-plan.model';
import { InternshipType } from 'src/app/core/models/enums/internship-type';
import { InternshipStatus } from 'src/app/core/models/enums/InternshipStatus';
import { RequestStatus } from 'src/app/core/models/enums/request-status';
import { Internship } from 'src/app/core/models/internship.model';
import { InternshipService } from 'src/app/core/services/internship.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { ActivityPlanAppraisalComponent } from '../activity-plan-appraisal/activity-plan-appraisal.component';

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

  constructor(
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private internshipService: InternshipService,
    private notificationService: NotificationService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');

    if (this.id) {
      this.loaderService.show();
      this.fetchInternship(this.id);
    }
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
    if (internshipType === InternshipType.REQUIRED_OR_NOT) {
      return 'Estágio obrigatório ou não obrigatório';
    }
    else if (internshipType === InternshipType.REQUIRED) {
      return 'Estágio obrigatório';
    }
    else if (internshipType === InternshipType.NOT_REQUIRED) {
      return 'Estágio não obrigatório';
    }
    else if (internshipType === InternshipType.PROJECT_EQUIVALENCE) {
      return 'Equiparação de projeto institucional';
    }
    else {
      return 'Aproveitamento Profissional';
    }
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

  handleCanAppraiseActivityPlan(activityPlan: ActivityPlan) {
    if (activityPlan.status === RequestStatus.PENDING) {
      return true;
    }
    return false;
  }

  handleInternshipIsInProgress() {
    if (this.internship.status === InternshipStatus.IN_PROGRESS) {
      return true
    }
    return false;
  }

  handleAppraiseActivityPlan($event: Event, deferred: boolean, activityPlanId: string) {
    $event.stopPropagation();
    this.dialog.open(ActivityPlanAppraisalComponent, this.getDialogConfig(deferred, activityPlanId));
  }
}
