import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { finalize, first, } from 'rxjs/operators';
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
  loading: boolean = true;
  advisorRequests: AdvisorRequest[] = [];
  advisorRequestsShow: AdvisorRequest[] = [];
  advisor: Advisor;
  filterNames: string[] = ['Pendentes', 'Deferidos', 'Indeferidos'];
  selectedFilter: number = 1;
  sort: boolean = false;

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
          this.advisor = advisor;
          this.loadPendingAdvisorRequests(advisor);
        }
      )
  }

  loadPendingAdvisorRequests(advisor: Advisor) {
    this.advisorRequestService.getByAdvisorId(advisor.id)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.loaderService.hide();
        })
      )
      .subscribe(
        requests => {
          this.advisorRequests = requests;
          this.advisorRequestsShow = this.advisorRequests.filter(r => r.status === RequestStatus.PENDING);
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

  private getFilterDialogConfig() {
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
            this.advisorRequestsShow = this.advisorRequests.filter(request => request.status === RequestStatus.PENDING);
          }
          if (this.selectedFilter === 2) {
            this.advisorRequestsShow = this.advisorRequests.filter(request => request.status === RequestStatus.ACCEPTED);
          }
          if (this.selectedFilter === 3) {
            this.advisorRequestsShow = this.advisorRequests.filter(request => request.status === RequestStatus.REJECTED);
          }
        },
        filterNames: this.filterNames,
        selected: this.selectedFilter
      }
    };
  }

  openFilterDialog() {
    this.dialog.open(FilterDialogComponent, this.getFilterDialogConfig())
      .afterClosed();
  }

  orderByName() {
    this.sort = !this.sort;
    if (this.sort) {
      this.advisorRequestsShow.sort((a, b) => a.student.user.name.localeCompare(b.student.user.name));
    }
    else {
      this.advisorRequests.sort((a, b) => a.expiresAt.toISOString().localeCompare(b.expiresAt.toISOString()));
    }
  }
}
