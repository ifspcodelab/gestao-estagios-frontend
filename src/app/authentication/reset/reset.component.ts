import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NotificationService} from "../../core/services/notification.service";
import {AppValidators} from "../../core/validators/app-validators";

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit {

  hide: boolean = false;
  form: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService,
  ) { }

  ngOnInit() {
    this.form= this.buildForm();
  }

  public onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }
  }

  field(path: string) {
    return this.form.get(path)!;
  }

  fieldErrors(path: string) {
    return this.field(path)?.errors;
  }

  buildForm(): FormGroup {
    return this.fb.group({
      password: ['',
        [Validators.required, AppValidators.notBlank, AppValidators.lowerCase, AppValidators.upperCase, AppValidators.number, Validators.minLength(8)]
      ],
    })
  }

  onReset() {
    if (this.form.valid) {
      return this.notificationService.success(`Senha alterada com sucesso!`);
    }

  }

}
