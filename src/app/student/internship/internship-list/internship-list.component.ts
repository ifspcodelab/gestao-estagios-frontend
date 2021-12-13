import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize, first } from 'rxjs/operators';
import { InternshipType } from 'src/app/core/models/enums/internship-type';
import { InternshipStatus } from 'src/app/core/models/enums/InternshipStatus';
import { RequestStatus } from 'src/app/core/models/enums/request-status';
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
    return InternshipType.toString(internshipType);
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
