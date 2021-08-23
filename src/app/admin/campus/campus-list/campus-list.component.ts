import { Component, OnInit } from '@angular/core';
import { Campus } from "../../../core/models/campus.model";
import { CampusService } from "../../../core/services/campus.service";
import { NotificationService } from "../../../core/services/notification.service";
import { LoaderService } from "../../../core/services/loader.service";
import { finalize } from "rxjs/operators";

@Component({
  selector: 'app-campus-list',
  templateUrl: './campus-list.component.html',
  styleUrls: ['./campus-list.component.scss']
})
export class CampusListComponent implements OnInit {
  campuses: Campus[];
  loading: boolean = true;

  constructor(
    private campusService: CampusService,
    private notificationService: NotificationService,
    private loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    this.loaderService.show();
    this.campusService.getCampuses()
      .pipe(
        finalize(() => {
          this.loaderService.hide();
          this.loading = false;
        })
      )
      .subscribe(
        campus => {
          this.campuses = campus;
        }
    );
  }

  toggleCampus($event: Event) {
    $event.stopPropagation();
    this.notificationService.success("Campus desativado com sucesso");
  }
}
