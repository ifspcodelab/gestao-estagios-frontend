import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AppValidators } from "../../core/validators/app-validators";
import { NotificationService } from "../../core/services/notification.service";
import { Student } from "../../core/models/student.model";
import { UserService } from 'src/app/core/services/user.service';
import { UserPasswordReset } from 'src/app/core/models/user.model';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit {

  hide: boolean = false;
  form: FormGroup;
  submitted = false;
  student: Student;

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.form = this.buildForm();
  }

  public onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    const userPasswordReset = new UserPasswordReset(this.field('registration').value);
    this.userService.sendEmailPassword(userPasswordReset)
      .pipe(first())
      .subscribe(
        _ => {
          this.notificationService.success("E-mail enviado para redefinição de senha.");
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
      registration: ['',
        [Validators.required, AppValidators.notBlank, Validators.maxLength(9), Validators.minLength(8)]
      ],
    })
  }

  emailMask(email: string) {
    let maskedEmail = email.replace(/([^@\.])/g, "*").split('');
    let previous = "";
    for(let i = 0; i < maskedEmail.length; i ++){
      if (i <= 1 || previous == "." || previous == "@"){
        maskedEmail[i] = email[i];
      }
      previous = email[i];
    }
    return maskedEmail.join('');
  }

}
