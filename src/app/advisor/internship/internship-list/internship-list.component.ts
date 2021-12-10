import { Component, OnInit } from '@angular/core';
import { finalize, first } from 'rxjs/operators';
import { InternshipType } from 'src/app/core/models/enums/internship-type';
import { InternshipStatus } from 'src/app/core/models/enums/InternshipStatus';
import { RequestStatus } from 'src/app/core/models/enums/request-status';
import { Internship } from 'src/app/core/models/internship.model';
import { AdvisorService } from 'src/app/core/services/advisor.service';
import { InternshipService } from 'src/app/core/services/internship.service';
import { JwtTokenService } from 'src/app/core/services/jwt-token.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';

@Component({
  selector: 'app-internship-list',
  templateUrl: './internship-list.component.html',
  styleUrls: ['./internship-list.component.scss']
})
export class InternshipListComponent implements OnInit {
  loading: boolean = true;
  internships: Internship[] = [];
  waitingDocsInternships: Internship[] = [];
  inProgressInternships: Internship[] = [];
  finishedInternships: Internship[] = [];

  constructor(
    private advisorService: AdvisorService,
    private internshipService: InternshipService,
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
          this.internshipService.getByAdvisorId(advisor.id)
            .pipe(
              finalize(() => {
                this.loading = false;
                this.loaderService.hide();
              })
            )
            .subscribe(
              internships => {
                this.internships = internships;
                this.waitingDocsInternships = this.internships.filter(i => i.status === InternshipStatus.ACTIVITY_PLAN_PENDING || i.status === InternshipStatus.ACTIVITY_PLAN_SENT);
                this.inProgressInternships = this.internships.filter(i => i.status === InternshipStatus.IN_PROGRESS || i.status === InternshipStatus.REALIZATION_TERM_ACCEPTED);
                this.finishedInternships = this.internships.filter(i => i.status === InternshipStatus.FINISHED);
              }
            )
        }
      )
  }

  handleType(internshipType: InternshipType): string {
    /*if (internshipType === InternshipType.REQUIRED_OR_NOT) {
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
    }*/
    return InternshipType.toString(internshipType)
  }

  handleStatus(status: InternshipStatus): string {
    return InternshipStatus.toString(status);
  }

  getInternshipCompanyName(internship: Internship): string {
    for (const activityPlan of internship.activityPlans) {
      if (activityPlan.status === RequestStatus.ACCEPTED) {
        return ' - ' + activityPlan.companyName;
      }
    }
    return '';
  }
}
