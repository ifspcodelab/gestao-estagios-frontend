import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, first } from 'rxjs/operators';
import { User, UserUpdate } from 'src/app/core/models/user.model';
import { LoaderService } from 'src/app/core/services/loader.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { UserService } from 'src/app/core/services/user.service';
import { AppValidators } from 'src/app/core/validators/app-validators';

@Component({
  selector: 'app-account-edit',
  templateUrl: './account-edit.component.html',
  styleUrls: ['./account-edit.component.scss']
})
export class AccountEditComponent implements OnInit {
  form: FormGroup;
  loading: boolean = true;
  submitted: boolean = false;
  registration: string;
  user: User;

  hide: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private loaderService: LoaderService,
    private userService: UserService,
    private notificationService: NotificationService,
    
  ) { }

  ngOnInit(): void {
    this.registration = this.route.snapshot.paramMap.get('registration')!;
    this.loading = true;
    this.loaderService.show();

    this.form = this.buildForm();
    
    this.userService.getUserByRegistration(this.registration!)
      .pipe(
        first(),
        finalize(() => {
          this.loaderService.hide();
          this.loading = false;
        })
      )
      .subscribe(
        user => {
          this.user = user;
          this.form.patchValue(user);
        },
        error => { 
          this.notificationService.error(`Usuário não encontrado com matrícula ${this.registration}`);
          this.router.navigate(['admin']);
        }
      )
  }

  buildForm(): FormGroup {
    return this.fb.group({
      name: ['',
        [Validators.required, AppValidators.notBlank, AppValidators.alpha]
      ],
      registration: ['',
        [Validators.required, AppValidators.notBlank, Validators.maxLength(9), Validators.minLength(8)]
      ],
      password: ['',
        [Validators.required, AppValidators.notBlank, AppValidators.lowerCase, AppValidators.upperCase, AppValidators.number, Validators.minLength(8)]
      ],
    });
  }

  field(path: string) {
    return this.form.get(path)!;
  }

  fieldErrors(path: string) {
    return this.field(path)?.errors;
  }

  onSubmit() {
    this.submitted = true;

    if(this.form.invalid) {
      return;
    }

    const userUpdate = new UserUpdate(this.field('name').value);
    this.userService.updateUser(this.user.id, userUpdate)
      .pipe(first())
      .subscribe(
        user => {
          this.form.reset({}, {emitEvent: false});
          this.registration = user.registration;
          this.user = user;
          this.notificationService.success("Conta editada com sucesso!");
          this.router.navigate([`admin/account/${this.registration}`]);
        }
      )
  }

  getBackUrl(): string {
    return `/admin/account/${this.user.registration}`;
  }

}
