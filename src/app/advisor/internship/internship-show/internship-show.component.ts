import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DateAdapter } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, first } from 'rxjs/operators';
import { ActivityPlan, ActivityPlanUpdate } from 'src/app/core/models/activity-plan.model';
import { InternshipType } from 'src/app/core/models/enums/internship-type';
import { InternshipStatus } from 'src/app/core/models/enums/InternshipStatus';
import { RequestStatus } from 'src/app/core/models/enums/request-status';
import { Internship } from 'src/app/core/models/internship.model';
import { ActivityPlanService } from 'src/app/core/services/activity-plan.service';
import { InternshipService } from 'src/app/core/services/internship.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { AppValidators } from "../../../core/validators/app-validators";

@Component({
  selector: 'app-internship-show',
  templateUrl: './internship-show.component.html',
  styleUrls: ['./internship-show.component.scss']
})
export class InternshipShowComponent implements OnInit {
  internship: Internship
  id: string | null;
  loading: boolean = true;
  form: FormGroup;
  submitted = false;
  minDate: Date;
  maxDate: Date;
  fileName: string = "Nenhum arquivo anexado.";
  data: FormData;

  constructor(
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private internshipService: InternshipService,
    private notificationService: NotificationService,
    private activityPlanService: ActivityPlanService,
    private router: Router,
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

  handleAppraiseActivityPlan($event: Event, deferred: boolean) {
    $event.stopPropagation();
  }

  openActivityPlan(activityPlan: ActivityPlan) {
    window.open(activityPlan.activityPlanUrl);
  }
}
