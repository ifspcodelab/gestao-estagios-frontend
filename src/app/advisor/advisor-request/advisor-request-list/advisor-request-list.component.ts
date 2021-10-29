import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { Observable } from 'rxjs';
import { finalize, first, map, tap } from 'rxjs/operators';
import { FilterDialogComponent } from 'src/app/core/components/filter-dialog/filter-dialog.component';
import { AdvisorRequest } from 'src/app/core/models/advisor-request.model';
import { Advisor } from 'src/app/core/models/advisor.model';
import { RequestStatus } from 'src/app/core/models/enums/request-status';
import { AdvisorRequestService } from 'src/app/core/services/advisor-request.service';
import { AdvisorService } from 'src/app/core/services/advisor.service';
import { JwtTokenService } from 'src/app/core/services/jwt-token.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';

@Component({
  selector: 'app-advisor-request-list',
  templateUrl: './advisor-request-list.component.html',
  styleUrls: ['./advisor-request-list.component.scss']
})
export class AdvisorRequestListComponent implements OnInit {
  advisorRequests$: Observable<AdvisorRequest[]>;
  advisor: Advisor;
  filterNames: string[] = ['Pendentes', 'Deferidos', 'Indeferidos'];
  selectedFilter: number = 1;

  constructor(
    private advisorRequestService: AdvisorRequestService,
    private advisorService: AdvisorService,
    private loaderService: LoaderService,
    private localStorageService: LocalStorageService,
    private jwtTokenService: JwtTokenService,
    private dialog: MatDialog
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
          this.advisor = advisor
          this.loadPendingAdvisorRequests(advisor);
        }
      )
  }

  loadPendingAdvisorRequests(advisor: Advisor) {
    this.advisorRequests$ = this.advisorRequestService.getByAdvisorId(advisor.id)
      .pipe(
        map(request => request.filter(r => r.status === RequestStatus.PENDING)),
        finalize(() => {
          this.loaderService.hide();
        })
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

  private getDialogConfig() {
    return {
      autoFocus: true,
      data: {
        onChange: ($event: MatRadioChange) => {
          if ($event.value == 1) {
            this.selectedFilter = 1;
          }
          if ($event.value == 2) {
            this.selectedFilter = 2;
          }
          if ($event.value == 3) {
            this.selectedFilter = 3;
          } 
        },
        handleFilter: () => {
          if (this.selectedFilter === 1) {
            this.loadPendingAdvisorRequests(this.advisor);
          }
          if (this.selectedFilter === 2) {
            this.advisorRequests$ = this.advisorRequestService.getByAdvisorId(this.advisor.id)
              .pipe(
                map(request => request.filter(r => r.status === RequestStatus.ACCEPTED)),
                finalize(() => {
                  this.loaderService.hide();
                })
              )
          }
          if (this.selectedFilter === 3) {
            this.advisorRequests$ = this.advisorRequestService.getByAdvisorId(this.advisor.id)
              .pipe(
                map(request => request.filter(r => r.status === RequestStatus.REJECTED)),
                finalize(() => {
                  this.loaderService.hide();
                })
              )
          }
        },
        filterNames: this.filterNames,
        selected: this.selectedFilter
      }
    };
  }

  openDialog() {
    this.dialog.open(FilterDialogComponent, this.getDialogConfig())
    .afterClosed()
  }
}
