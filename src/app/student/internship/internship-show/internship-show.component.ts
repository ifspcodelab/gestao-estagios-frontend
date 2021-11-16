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
    private fb: FormBuilder,
    private adapter: DateAdapter<any>,
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private internshipService: InternshipService,
    private notificationService: NotificationService,
    private router: Router,
    private activityPlanService: ActivityPlanService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');

    if (this.id) {
      this.loaderService.show();
      this.fetchInternship(this.id);
    }

    this.adapter.setLocale('pt-br');
    const currentDate = new Date();
    this.minDate = new Date(currentDate.setDate(currentDate.getDate() + 1));

    this.form = this.buildForm();
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
            this.notificationService.error(`Campus não encontrado com id ${this.id}`);
            this.router.navigate(['student/internship']);
          }
        }
      )
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
      this.fileName = file.name;
      this.data = new FormData();
      this.data.append('file', file);
    }
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
}
