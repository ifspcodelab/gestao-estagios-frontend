import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, first } from 'rxjs/operators';
import { AdvisorRequest } from 'src/app/core/models/advisor-request.model';
import { RequestStatus } from 'src/app/core/models/enums/request-status';
import { AdvisorRequestService } from 'src/app/core/services/advisor-request.service';
import { JwtTokenService } from 'src/app/core/services/jwt-token.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { StudentService } from 'src/app/core/services/student.service';

@Component({
  selector: 'app-advisor-request-list',
  templateUrl: './advisor-request-list.component.html',
  styleUrls: ['./advisor-request-list.component.scss']
})
export class AdvisorRequestListComponent implements OnInit {
  advisorRequests$: Observable<AdvisorRequest[]>

  constructor(
    private advisorRequestService: AdvisorRequestService,
    private studentService: StudentService,
    private notificationService: NotificationService,
    private loaderService: LoaderService,
    private localStorageService: LocalStorageService,
    private jwtTokenService: JwtTokenService,
    private router: Router
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
          this.advisorRequests$ = this.advisorRequestService.getByStudentId(student.id)
            .pipe(
              finalize(() => {
                this.loaderService.hide();
              })
            )
        }
      )
  }

  handleStatus(requestStatus: RequestStatus): string {
    if (requestStatus === RequestStatus.PENDING) {
      return "Pendente";
    }
    else if (requestStatus === RequestStatus.ACCEPTED) {
      return "Deferido";
    }
    else {
      return "Indeferido";
    }
  }

  handleCanCreate(advisorRequests: AdvisorRequest[]) {
    let hasRequest: boolean = false;
    advisorRequests.forEach(request => {
      if (request.status === RequestStatus.PENDING) {
        hasRequest = true;
      }
    })

    if (hasRequest) {
      this.notificationService.error('Não é possível realizar um pedido de orientação enquanto há um pendente.');
    }
    else {
      this.router.navigate(['student/advisor-request/create']);
    }
  }
}
