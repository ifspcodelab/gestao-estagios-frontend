import { Component, OnInit } from '@angular/core';
import { Campus } from "../../../core/models/campus.model";
import { CampusService } from "../../../core/services/campus.service";
import { NotificationService } from "../../../core/services/notification.service";
import { LoaderService } from "../../../core/services/loader.service";
import { finalize, first, map } from "rxjs/operators";
import { Observable } from "rxjs";
import { EntityStatus } from 'src/app/core/models/enums/status';
import { EntityUpdateStatus } from 'src/app/core/models/status.model';
import { MatDialog } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { FilterDialogComponent } from 'src/app/core/components/filter-dialog/filter-dialog.component';


@Component({
  selector: 'app-campus-list',
  templateUrl: './campus-list.component.html',
  styleUrls: ['./campus-list.component.scss']
})
export class CampusListComponent implements OnInit {
  campuses$: Observable<Campus[]>;
  selectedFilter: number = 1; 
  filterNames: string[] = ['Todos', 'Habilitados', 'Desabilitados'];
  constructor(
    private campusService: CampusService,
    private notificationService: NotificationService,
    private loaderService: LoaderService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.loaderService.show();
    this.campuses$ = this.campusService.getCampuses()
      .pipe(
        finalize(() => {
          this.loaderService.hide();
        })
    );
  }

  loadAll(): void {
    this.loaderService.show();
    this.campuses$ = this.campusService.getCampuses()
      .pipe(
        finalize(() => {
          this.loaderService.hide();
        })
    );
  }
  
  private getDialogConfig() {
    return {
      autoFocus: true,
      data: {
        filterNames: this.filterNames,
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
          if (this.selectedFilter == 1) {
            this.loaderService.show();
            this.campuses$ = this.campusService.getCampuses()
              .pipe(
                finalize(() => {
                  this.loaderService.hide();
                })
              );
          }
          if (this.selectedFilter == 2 ) {
            this.loaderService.show();
            this.campuses$ = this.campusService.getCampuses()
              .pipe(
                map(campus => campus.filter(c => c.status === EntityStatus.ENABLED)),
                finalize(() => {
                  this.loaderService.hide();
                })
              );
          }
          if (this.selectedFilter == 3) {
            this.loaderService.show();
            this.campuses$ = this.campusService.getCampuses()
              .pipe(
                map(campus => campus.filter(c => c.status === EntityStatus.DISABLED)),
                finalize(() => {
                  this.loaderService.hide();
                })
              );
          }
          this.dialog.closeAll();
        },
        selected: this.selectedFilter
      }
    };
  }

  openDialog() {
    this.dialog.open(FilterDialogComponent, this.getDialogConfig())
    .afterClosed()
  }

  handleEnabled(campus: Campus): boolean {
    return campus.status == EntityStatus.ENABLED ? true : false;
  }

  toggleCampus($event: Event, campus: Campus) {
    $event.stopPropagation();
    if (campus.status === EntityStatus.ENABLED){
      this.campusService.patchCampus(campus.id, new EntityUpdateStatus(EntityStatus.DISABLED))
        .pipe(first())
        .subscribe(
          _ => {
            this.notificationService.success("Campus desativado com sucesso");
            campus.status = EntityStatus.DISABLED;
          }
        )
    } else {
      this.campusService.patchCampus(campus.id, new EntityUpdateStatus(EntityStatus.ENABLED))
        .pipe(first())
        .subscribe(
          _ => {
            this.notificationService.success("Campus ativado com sucesso");
            campus.status = EntityStatus.ENABLED;
          }
        )
    }
  }
}
