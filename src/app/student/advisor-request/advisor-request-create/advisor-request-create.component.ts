import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { finalize, first } from 'rxjs/operators';
import { Advisor } from 'src/app/core/models/advisor.model';
import { AdvisorRequestService } from 'src/app/core/services/advisor-request.service';
import { AdvisorService } from 'src/app/core/services/advisor.service';
import { JwtTokenService } from 'src/app/core/services/jwt-token.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { StudentService } from 'src/app/core/services/student.service';
import { AppValidators } from 'src/app/core/validators/app-validators';

@Component({
  selector: 'app-advisor-request-create',
  templateUrl: './advisor-request-create.component.html',
  styleUrls: ['./advisor-request-create.component.scss']
})
export class AdvisorRequestCreateComponent implements OnInit {
  advisors$: Observable<Advisor[]>;
  form: FormGroup;
  submitted: boolean = false;

  constructor(
    private studentService: StudentService,
    private advisorService: AdvisorService,
    private advisorRequestService: AdvisorRequestService,
    private loaderService: LoaderService,
    private localStorageService: LocalStorageService,
    private jwtTokenService: JwtTokenService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.form = this.buildForm();
    this.loaderService.show();

    this.jwtTokenService.setToken(this.localStorageService.get('access_token')!);
    const userId = this.jwtTokenService.getSubjectId();

    this.studentService.getStudentByUserId(userId!)
      .pipe(first())
      .subscribe(
        student => {
          this.advisors$ = this.advisorService.getAdvisorsByCourseId(student.curriculum.course.id)
            .pipe(
              finalize(() => {
                this.loaderService.hide();
              })
            )
        }
      )
  }

  buildForm(): FormGroup {
    return this.fb.group({
      name: ['',
        [Validators.required, AppValidators.notBlank, AppValidators.alpha]
      ],
      details: ['',
        [Validators.required, AppValidators.notBlank]
      ]
    })
  }

  getBackUrl(): string {
    return '/student/advisor-request';
  }

  
  field(path: string) {
    return this.form.get(path)!;
  }
  
  fieldErrors(path: string) {
    return this.field(path)?.errors;
  }
  
  onSubmit() {

  }
}
