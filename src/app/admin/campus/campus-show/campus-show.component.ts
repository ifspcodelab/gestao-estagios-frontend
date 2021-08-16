import { Component, OnInit } from '@angular/core';
import { Campus } from "../../../core/models/campus.model";
import { CampusService } from "../../../core/services/campus.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { finalize } from "rxjs/operators";
import { HttpErrorResponse } from "@angular/common/http";
import { NotificationService } from "../../../core/services/notification.service";

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
    public location: Location,
    private notificationService: NotificationService
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
        this.notificationService.error(`Campus não encontrado com id ${this.id}`)
      }
      this.navigateToList();
    }
  }

  navigateToList() {
    this.router.navigate(['admin/campus']);
  }

}
