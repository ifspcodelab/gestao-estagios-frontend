import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RequestStatus } from 'src/app/core/models/enums/request-status';
import { RealizationTermAppraisal } from 'src/app/core/models/realization-term.model';
import { NotificationService } from 'src/app/core/services/notification.service';
import { first } from 'rxjs/operators';
import { RealizationTermService } from 'src/app/core/services/realization-term.service';

@Component({
  selector: 'app-realization-term-appraisal',
  templateUrl: './realization-term-appraisal.component.html',
  styleUrls: ['./realization-term-appraisal.component.scss']
})
export class RealizationTermAppraisalComponent implements OnInit {
  form: FormGroup;
  submitted: boolean;
  realizationTermStatus: RequestStatus;

  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { internshipId: string, realizationTermId: string, deferred: boolean },
    private dialogRef: MatDialogRef<RealizationTermAppraisalComponent>,
    private fb: FormBuilder,
    private realizationTermService: RealizationTermService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    const header = document.getElementById('header');
    if (this.data.deferred) {
      this.realizationTermStatus = RequestStatus.ACCEPTED;
      header!.innerHTML = "Deferir Termo de Realização";
    } else {
      this.realizationTermStatus = RequestStatus.REJECTED;
      header!.innerHTML = "Indeferir Termo de Realização";
    }

    this.form = this.buildForm();
  }

  buildForm(): FormGroup {
    if (this.data.deferred) {
      return this.fb.group({
        'details': ['', [Validators.required]],
      })
    } 
    else {
      return this.fb.group({
        'details': ['', [Validators.required]]
      })
    }
  }

  field(path: string) {
    return this.form.get(path)!;
  }

  fieldErrors(path: string) {
    return this.field(path)?.errors;
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return
    }

    const realizationTermAppraisal = new RealizationTermAppraisal(
      this.realizationTermStatus,
      this.field('details').value
    );
    this.realizationTermService.appraise(this.data.internshipId, this.data.realizationTermId, realizationTermAppraisal)
      .pipe(first())
      .subscribe(
        realizationTerm => {
          this.notificationService.success('Termo de Realização avaliado com sucesso!');
          this.dialogRef.close(realizationTerm);
        }
      )
  }

}
