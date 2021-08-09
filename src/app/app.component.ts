import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from "@angular/material/sidenav";
import {SidebarService} from "./sidebar/sidebar.service";
import {SidebarComponent} from "./sidebar/sidebar.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'gestao-estagios-frontend';
  @ViewChild('sidebar', { static: true }) sidebar: SidebarComponent;

  constructor(private sidenavService: SidebarService) {  }

  ngAfterViewInit(): void {
    this.sidenavService.setSidebar(this.sidebar);
  }
}
