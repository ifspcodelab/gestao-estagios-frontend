import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { RequestAppraisalCreate } from 'src/app/core/models/request-appraisal.model';
import { NotificationService } from 'src/app/core/services/notification.service';
import { RequestAppraisalService } from 'src/app/core/services/request-appraisal.service';

@Component({
  selector: 'app-request-appraisal-create',
  templateUrl: './request-appraisal-create.component.html',
  styleUrls: ['./request-appraisal-create.component.scss']
})
export class RequestAppraisalCreateComponent implements OnInit {
  form: FormGroup; 
  submitted: boolean = false;
  date: number;
  minDate: string;
  sendEmailToAdvisor: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { advisorRequestId: string, deferred: boolean },
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private dialogRef: MatDialogRef<RequestAppraisalCreateComponent>,
    private router: Router,
    private notificationService: NotificationService,
    private requestAppraisalService: RequestAppraisalService
  ) { }

  ngOnInit(): void {
    this.date = Date.now() + 86400000;
    this.minDate = this.datePipe.transform(this.date, 'yyyy-MM-ddThh:mm')!;

    this.form = this.buildForm();
    const header = document.getElementById('header');

    if (this.data.deferred) {
      header!.innerHTML = "Deferir Pedido";
    } 
    else {
      header!.innerHTML = "Indeferir Pedido";
    }
  }

  field(path: string) {
    return this.form.get(path)!;
  }

  fieldErrors(path: string) {
    return this.field(path)?.errors;
  }

  buildForm(): FormGroup {
    if (this.data.deferred) {
      return this.fb.group({
        'details': ['', [Validators.required]],
        'date': ['', []],
      })
    } 
    else {
      return this.fb.group({
        'details': ['', [Validators.required]]
      })
    }
  }

  handleSendEmail() {
    this.sendEmailToAdvisor = !this.sendEmailToAdvisor;
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    let date = '';
    if (this.data.deferred) {
      date = new Date(this.field('date')?.value).toISOString();
    }
    const requestAppraisalCreate = new RequestAppraisalCreate(
      this.field('details').value,
      this.data.deferred,
      date,
      this.sendEmailToAdvisor
    );
    this.requestAppraisalService.postRequestAppraisal(this.data.advisorRequestId, requestAppraisalCreate)
      .pipe(first())
      .subscribe(
        _ => {
          this.notificationService.success('Pedido avaliado com sucesso!');
          this.dialogRef.close();
          this.router.navigate(['advisor/advisor-request']);
        }
      )
  }
}
