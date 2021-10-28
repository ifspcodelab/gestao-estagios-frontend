import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, first } from 'rxjs/operators';
import { AdvisorRequestCreate } from 'src/app/core/models/advisor-request.model';
import { Advisor } from 'src/app/core/models/advisor.model';
import { InternshipType } from 'src/app/core/models/enums/internship-type';
import { Parameter } from 'src/app/core/models/parameter.model';
import { Student } from 'src/app/core/models/student.model';
import { AdvisorRequestService } from 'src/app/core/services/advisor-request.service';
import { AdvisorService } from 'src/app/core/services/advisor.service';
import { JwtTokenService } from 'src/app/core/services/jwt-token.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { ParameterService } from 'src/app/core/services/parameter.service';
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
  parameter: Parameter;
  internshipMessage: string = '';

  student: Student;
  advisor: Advisor;
  internshipType: InternshipType = InternshipType.REQUIRED_OR_NOT;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private advisorService: AdvisorService,
    private advisorRequestService: AdvisorRequestService,
    private parameterService: ParameterService,
    private loaderService: LoaderService,
    private localStorageService: LocalStorageService,
    private jwtTokenService: JwtTokenService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.buildForm();
    this.loaderService.show();

    this.jwtTokenService.setToken(this.localStorageService.get('access_token')!);
    const userId = this.jwtTokenService.getSubjectId();

    this.parameterService.getParameters()
      .pipe(first())
      .subscribe(
        parameter => {
          this.parameter = parameter;
          this.internshipMessage = this.parameter.internshipRequiredOrNotMessage;
        }
      )
      
    this.studentService.getStudentByUserId(userId!)
      .pipe(first())
      .subscribe(
        student => {
          this.student = student;
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
    this.submitted = true;

    const advisorRequestCreate = new AdvisorRequestCreate(
      this.internshipType, 
      this.field('details').value,
      this.student.id,
      this.student.curriculum.id,
      this.advisor.id
    );
    this.advisorRequestService.postAdvisorRequest(advisorRequestCreate)
      .pipe(first())
      .subscribe (
        _ => {
          this.notificationService.success(`Pedido de orientação realizado com sucesso! Aguarde a avaliação do orientador ${this.advisor.user.name}`);
          this.router.navigate(['student/advisor-request']);
        }
      )
  }

  onRadioChange($event: MatRadioChange): void {
    if ($event.value == 1) {
      this.internshipMessage = this.parameter.internshipRequiredOrNotMessage;
      this.internshipType = InternshipType.REQUIRED_OR_NOT;
    }
    if ($event.value == 2) {
      this.internshipMessage = this.parameter.projectEquivalenceMessage;
      this.internshipType = InternshipType.PROJECT_EQUIVALENCE;
    }
    if ($event.value == 3) {
      this.internshipMessage = this.parameter.professionalValidationMessage;
      this.internshipType = InternshipType.PROFESSIONAL_VALIDATION;
    } 
  }

  onAdvisorSelected(advisor: Advisor, index: number): void {
    this.advisor = advisor;
    const element = document.getElementsByClassName('advisors');
    for (let i = 0; i < element.length; i++) {
      element[i].classList.remove('selected');
    }
    document.getElementsByClassName('advisors')[index].classList.add('selected');
  }
}
