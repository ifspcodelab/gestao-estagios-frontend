import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, first } from 'rxjs/operators';
import { ListItens } from 'src/app/core/components/content/content-detail/content-detail.component';
import { AdvisorRequest } from 'src/app/core/models/advisor-request.model';
import { Campus } from 'src/app/core/models/campus.model';
import { Course } from 'src/app/core/models/course.model';
import { Curriculum } from 'src/app/core/models/curriculum.model';
import { InternshipType } from 'src/app/core/models/enums/internship-type';
import { RequestStatus } from 'src/app/core/models/enums/request-status';
import { AdvisorRequestService } from 'src/app/core/services/advisor-request.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { RequestAppraisalCreateComponent } from '../request-appraisal-create/request-appraisal-create.component';

@Component({
  selector: 'app-advisor-request-show',
  templateUrl: './advisor-request-show.component.html',
  styleUrls: ['./advisor-request-show.component.scss']
})
export class AdvisorRequestShowComponent implements OnInit {
  id: string | null;
  loading: boolean = true;
  advisorRequest: AdvisorRequest;
  link: string;
  internshipType: string;

  constructor(
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private loaderService: LoaderService,
    private advisorRequestService: AdvisorRequestService,
    private datePipe: DatePipe,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');

    if (this.id) {
      this.loaderService.show();
      this.advisorRequestService.getById(this.id)
        .pipe(
          first(),
          finalize(() => {
            this.loaderService.hide();
            this.loading = false;
          })
        )
        .subscribe(
          advisorRequest => {
            this.advisorRequest = advisorRequest;
            this.link = `https://suap.ifsp.edu.br/edu/aluno/${this.advisorRequest.student.user.registration}/`;
            this.handleInternshipType();
          }
        )
    }
  }

  handleInternshipType() {
    if (this.advisorRequest.internshipType === InternshipType.REQUIRED_OR_NOT) {
      this.internshipType = "Estágio obrigatório ou não obrigatório";
    } 
    else if (this.advisorRequest.internshipType === InternshipType.PROJECT_EQUIVALENCE) {
      this.internshipType = "Equiparação de projeto institucional";
    }
    else {
      this.internshipType = "Aproveitamento profissional";
    }
  }

  requestDetails(): ListItens {
    const getCampusData = () => {
      const campus: Campus = this.advisorRequest.curriculum.course.department.campus;
      return `Campus: ${campus.name}`;
    }
    const getCourseData = () => {
      const course: Course = this.advisorRequest.curriculum.course;
      return `Curso: ${course.name}`;
    }
    const getCurriculumData = () => {
      const curriculum: Curriculum = this.advisorRequest.curriculum;
      return `Matriz: ${curriculum.code}`;
    }
    return {
      itens: [
        { icon: 'place', title: 'Informações do Aluno', lines: [getCampusData(), getCourseData(), getCurriculumData()]
        },
        { icon: 'contact_support', title: 'Dados do pedido', lines: [
            `Tipo de orientação: ${this.internshipType}`,
            `Detalhes: ${this.advisorRequest.details}`,
            `Prazo para avaliação: ${this.datePipe.transform(this.advisorRequest.expiresAt, 'dd/MM/yyyy')!}`,
          ]
        }
      ]
    };
  }

  openProfile() {
    window.open(this.link);
  }

  private getDialogConfig(deferred: boolean) {
    return {
      autoFocus: true,
      data: {
        deferred: deferred,
        advisorRequestId: this.id
      }
    };
  }

  handlerCreateAppraisal(deferred: boolean) {
    if (this.advisorRequest.status === RequestStatus.PENDING) {
      this.dialog.open(RequestAppraisalCreateComponent, this.getDialogConfig(deferred));
    }
    else {
      this.notificationService.error('Não é possível avaliar o pedido de avaliação novamente!');
    }
  }
}
