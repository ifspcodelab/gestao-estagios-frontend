import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { UserRedefinePassword } from 'src/app/core/models/user.model';
import { NotificationService } from 'src/app/core/services/notification.service';
import { UserService } from 'src/app/core/services/user.service';
import { AppValidators } from 'src/app/core/validators/app-validators';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  hide: boolean = false;
  form: UntypedFormGroup;
  submitted = false;

  id: string | null;

  constructor(
    private fb: UntypedFormBuilder,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    this.form = this.buildForm();
  }

  public onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    const userRedefinePassword = new UserRedefinePassword(this.field('password').value)
    this.userService.redefinePassword(this.id!, userRedefinePassword)
      .pipe(first())
      .subscribe(
        _ => {
          this.notificationService.success("Senha redefinda com sucesso!");
          this.router.navigate(['authentication/login']);
        }
      )
  }

  field(path: string) {
    return this.form.get(path)!;
  }

  fieldErrors(path: string) {
    return this.field(path)?.errors;
  }

  buildForm(): UntypedFormGroup {
    return this.fb.group({
      password: ['',
        [Validators.required, AppValidators.notBlank, AppValidators.lowerCase, AppValidators.upperCase, AppValidators.number, Validators.minLength(8)]
      ],
    })
  }

}
