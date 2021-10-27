import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, first } from 'rxjs/operators';
import { AdvisorRequest } from 'src/app/core/models/advisor-request.model';
import { RequestStatus } from 'src/app/core/models/enums/request-status';
import { AdvisorRequestService } from 'src/app/core/services/advisor-request.service';
import { AdvisorService } from 'src/app/core/services/advisor.service';
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
    private advisorService: AdvisorService,
    private loaderService: LoaderService,
    private localStorageService: LocalStorageService,
    private jwtTokenService: JwtTokenService,
  ) { }

  ngOnInit(): void {
    this.loaderService.show();

    this.jwtTokenService.setToken(this.localStorageService.get('access_token')!);
    const userId = this.jwtTokenService.getSubjectId();

    this.advisorService.getAdvisorByUserId(userId!)
      .pipe(
        first()
      )
      .subscribe(
        advisor => {
          this.advisorRequests$ = this.advisorRequestService.getByAdvisorId(advisor.id)
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
}
