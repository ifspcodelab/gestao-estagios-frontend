import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { Campus } from "../../../core/models/campus.model";
import { CampusService } from "../../../core/services/campus.service";

@Component({
  selector: 'app-campus-list',
  templateUrl: './campus-list.component.html',
  styleUrls: ['./campus-list.component.scss']
})
export class CampusListComponent implements OnInit {
  campuses$: Observable<Campus[]>;
  loading: boolean = true;

  constructor(private campusService: CampusService) { }

  ngOnInit(): void {
    this.campuses$ = this.campusService.getCampuses();
    this.campuses$.subscribe(
      () => this.loading = false
    )
  }

}
