import { Component, OnInit } from '@angular/core';
import { Campus } from "../../../core/models/campus.model";
import { CampusService } from "../../../core/services/campus.service";
import { ActivatedRoute, Router } from "@angular/router";
import { finalize } from "rxjs/operators";
import { HttpErrorResponse } from "@angular/common/http";
import { NotificationService } from "../../../core/services/notification.service";
import { ConfirmDialogService } from "../../../core/services/confirm-dialog.service";

@Component({
  selector: 'app-campus-show',
  templateUrl: './campus-show.component.html',
  styleUrls: ['./campus-show.component.scss']
})
export class CampusShowComponent implements OnInit {
  loading: boolean = true;
  campus: Campus;
  id: string | null;
  constructor(
    private campusService: CampusService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService,
    private confirmDialogService: ConfirmDialogService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');

    if(this.id) {
      this.getCampus(this.id);
    }
  }

  getCampus(id: string) {
    this.campusService.getCampusById(id)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe(
        campus => {
          this.campus = campus;
          this.loading = false;
        },
        error => this.handleError(error)
      )
  }

  handleError(error: any) {
    if (error instanceof HttpErrorResponse) {
      if(error.status === 404) {
        this.notificationService.error(`Campus não encontrado com id ${this.id}`);
      }
      this.navigateToList();
    }
  }

  delete() {
    this.confirmDialogService.confirm().subscribe(
      result => {
        if(result) {
          this.campusService.deleteCampus(this.id!).subscribe(
            result => {
              console.log(result);
              this.notificationService.success(`Campus ${this.campus.abbreviation} removido com sucesso`);
              this.navigateToList();
            },
            error => this.handleError(error)
          )
        }
      }
    )
  }

  navigateToList() {
    this.router.navigate(['admin/campus']);
  }
}
