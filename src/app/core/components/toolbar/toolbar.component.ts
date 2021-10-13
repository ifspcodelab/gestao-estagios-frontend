import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage.service';
import { SidebarService } from "../sidebar/sidebar.service";

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  constructor(
    private sidenavService: SidebarService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  toggleRightSidenav() {
    this.sidenavService.toggle();
  }

  logout(){
    this.localStorageService.remove('access_token');
    this.localStorageService.remove('refresh_token');
    this.router.navigate(['authentication/login']);
  }

}
