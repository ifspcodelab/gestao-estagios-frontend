import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { AppValidators } from "../../../core/validators/app-validators";
import { Parameter, ParameterCreate } from "../../../core/models/parameter.model";
import { ParameterService } from "../../../core/services/parameter.service";
import { finalize, first } from "rxjs/operators";
import { NotificationService } from "../../../core/services/notification.service";
import { HttpErrorResponse } from "@angular/common/http";
import { LoaderService } from "../../../core/services/loader.service";
import { InformationComponent } from "../information/information.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: 'app-parameter-create',
  templateUrl: './parameter-create.component.html',
  styleUrls: ['./parameter-create.component.scss']
})
export class ParameterCreateComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  parameter: Parameter;
  createMode: boolean;
  loading: boolean = true;

  constructor(
    private fb: FormBuilder,
    private parameterService: ParameterService,
    private notificationService: NotificationService,
    private loaderService: LoaderService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.form = this.buildForm();
    this.loaderService.show();
    this.parameterService.getParameters()
      .pipe(
        first(),
        finalize(() => {
          this.loaderService.hide();
          this.loading = false;
        })
      )
      .subscribe(
        (parameter: Parameter) => {
          this.parameter = parameter;
          this.form.patchValue(parameter);
        }
      )
  }

  openDialog() {
    this.dialog.open(InformationComponent);
  }

  field(path: string) {
    return this.form.get(path)!;
  }

  fieldErrors(path: string) {
    return this.field(path)?.errors;
  }

  buildForm(): FormGroup {
    return this.fb.group({
      internshipRequiredOrNotMessage: ['',
        [Validators.required, AppValidators.notBlank]
      ],
      projectEquivalenceMessage: ['',
        [Validators.required, AppValidators.notBlank]
      ],
      professionalValidationMessage: ['',
        [Validators.required, AppValidators.notBlank]
      ],
      advisorRequestDeadline: ['',
        [Validators.required, AppValidators.numeric, Validators.max(180)]
      ],
      activityPlanAppraisalDeadline: ['',
        [Validators.required, AppValidators.numeric, Validators.max(180)]
      ],
      activityPlanLink: ['',
        [Validators.required, AppValidators.notBlank]
      ],
      activityPlanFileSizeMegabytes: ['',
        [Validators.required, AppValidators.numeric]
      ],
      monthlyReportFileSizeMegabytes: ['',
        [Validators.required, AppValidators.numeric]
      ],
      monthlyReportDraftSubmissionDeadlineMonths: ['',
        [Validators.required, AppValidators.numeric]
      ],
      monthlyReportDraftAppraisalDeadlineDays: ['',
        [Validators.required, AppValidators.numeric, Validators.max(180)]
      ],
      monthlyReportAppraisalDeadlineDays: ['',
        [Validators.required, AppValidators.numeric, Validators.max(180)]
      ],
      initialDispatchHtml: ['',
        [Validators.required, AppValidators.notBlank]
      ],
      finalDispatchHtml: ['',
        [Validators.required, AppValidators.notBlank]
      ]
    });
  }

  public onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }
    this.updateParameter();
  }

  updateParameter() {
    const parameterCreate = new ParameterCreate(
      this.field('internshipRequiredOrNotMessage').value,
      this.field('projectEquivalenceMessage').value,
      this.field('professionalValidationMessage').value,
      this.field('advisorRequestDeadline').value,
      this.field('activityPlanAppraisalDeadline').value,
      this.field('activityPlanLink').value,
      this.field('activityPlanFileSizeMegabytes').value,
      this.field('monthlyReportFileSizeMegabytes').value,
      this.field('monthlyReportDraftSubmissionDeadlineMonths').value,
      this.field('monthlyReportDraftAppraisalDeadlineDays').value,
      this.field('monthlyReportAppraisalDeadlineDays').value,
      this.field('initialDispatchHtml').value,
      this.field('finalDispatchHtml').value,
    );

    this.parameterService.updateParameters(parameterCreate)
      .pipe(first())
      .subscribe(
        (parameter: Parameter) => {
          this.parameter = parameter;
          this.notificationService.success(`Parâmetros editados com sucesso!`);
        },
        error => this.handleError(error)
    );
  }

  handleError(error: any) {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 400) {
        const violations: Array<{ name: string; reason: string }> = error.error.violations;
        violations.forEach(violation => {
          const formControl = this.form.get(violation.name);
          if (formControl) {
            formControl.setErrors({
              serverError: violation.reason
            });
          }
        })
      }
    }
  }
}
