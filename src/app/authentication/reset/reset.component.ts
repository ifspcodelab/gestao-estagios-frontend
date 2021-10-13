import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NotificationService } from "../../core/services/notification.service";
import { AppValidators } from "../../core/validators/app-validators";
import { ActivatedRoute, Router } from "@angular/router";
import { Advisor, UserAdvisorActivate } from 'src/app/core/models/advisor.model';
import { AdvisorService } from 'src/app/core/services/advisor.service';
import { first } from 'rxjs/operators';
import { EntityStatus } from 'src/app/core/models/enums/status';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit {
  hide: boolean = false;
  form: FormGroup;
  submitted = false;

  id: string | null;
  advisor: Advisor;

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router,
    private advisorService: AdvisorService
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    this.advisorService.getAdvisorById(this.id!).pipe(first())
    .subscribe(
      advisor => {
        this.advisor = advisor;
      }
    )

    this.form = this.buildForm();
  }

  public onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    if (this.advisor.user.isActivated === EntityStatus.ENABLED) {
      this.notificationService.error("Orientador já habilitado e com senha definida no sistema.");
      this.router.navigate(['authentication/login']);
    }
    else {
      const userAdvisorActivate = new UserAdvisorActivate(this.field('password').value);
      this.advisorService.activateAdvisor(this.id!, userAdvisorActivate)
        .pipe(first())
        .subscribe(
          _ => {
            this.form.reset({}, {emitEvent: false});
            this.notificationService.success("Senha definida com sucesso!");
            this.router.navigate(['authentication/login']);
          }
        )

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
}
