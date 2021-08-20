import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { Campus } from "../../../core/models/campus.model";
import { CampusService } from "../../../core/services/campus.service";
import { NotificationService } from "../../../core/services/notification.service";

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
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.campusService.getCampuses().subscribe(
      campus => {
        this.campuses = campus;
        this.loading = false;
      }
    );
  }

  toggleCampus($event: Event) {
    $event.stopPropagation();
    this.notificationService.success("Campus desativado com sucesso");
  }
}
