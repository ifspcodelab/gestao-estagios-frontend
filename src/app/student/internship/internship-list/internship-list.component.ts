import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize, first } from 'rxjs/operators';
import { InternshipType } from 'src/app/core/models/enums/internship-type';
import { InternshipStatus } from 'src/app/core/models/enums/InternshipStatus';
import { Internship } from 'src/app/core/models/internship.model';
import { InternshipService } from 'src/app/core/services/internship.service';
import { JwtTokenService } from 'src/app/core/services/jwt-token.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { StudentService } from 'src/app/core/services/student.service';

@Component({
  selector: 'app-internship-list',
  templateUrl: './internship-list.component.html',
  styleUrls: ['./internship-list.component.scss']
})
export class InternshipListComponent implements OnInit {
  internships$: Observable<Internship[]>

  constructor(
    private studentService: StudentService,
    private internshipService: InternshipService,
    private loaderService: LoaderService,
    private localStorageService: LocalStorageService,
    private jwtTokenService: JwtTokenService,
  ) { }

  ngOnInit(): void {
    this.loaderService.show();

    this.jwtTokenService.setToken(this.localStorageService.get('access_token')!);
    const userId = this.jwtTokenService.getSubjectId();

    this.studentService.getStudentByUserId(userId!)
      .pipe(
        first()
      )
      .subscribe(
        student => {
          this.internships$ = this.internshipService.getByStudentId(student.id)
            .pipe(
              finalize(() => {
                this.loaderService.hide();
              })
            )
        }
      )
  }

  handleType(internshipType: InternshipType): string {
    if (internshipType === InternshipType.REQUIRED_OR_NOT) {
      return 'Estágio obrigatório ou não obrigatório';
    }
    else if (internshipType === InternshipType.REQUIRED) {
      return 'Estágio obrigatório';
    }
    else if (internshipType === InternshipType.NOT_REQUIRED) {
      return 'Estágio não obrigatório';
    }
    else if (internshipType === InternshipType.PROJECT_EQUIVALENCE) {
      return 'Equiparação de projeto institucional';
    }
    else {
      return 'Aproveitamento Profissional';
    }
  }

  handleStatus(status: InternshipStatus): string {
    if (status == InternshipStatus.ACTIVITY_PLAN_PENDING) {
      return 'PLANO DE ATIVIDADES PENDENTE';
    }
    else if (status == InternshipStatus.ACTIVITY_PLAN_SENT) {
      return 'PLANO DE ATIVIDADES ENVIADO';
    }
    else if (status == InternshipStatus.IN_PROGRESS) {
      return 'EM ANDAMENTO';
    }
    else {
      return 'EM FINALIZAÇÃO'
    }
  }

}
