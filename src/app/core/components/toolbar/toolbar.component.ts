import { Component, OnInit } from '@angular/core';
import { SidebarService } from "../sidebar/sidebar.service";
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  constructor(
    private sidenavService: SidebarService,
    private matMenu: MatMenuModule,

  ) { }

  ngOnInit(): void {
  }

  toggleRightSidenav() {
    this.sidenavService.toggle();
  }

  toggleAccount() {

  }
}
