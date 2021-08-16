import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import {MatSidenav} from "@angular/material/sidenav";
import { SideBarGroup } from "./sidebar.group.model";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, AfterViewInit {
  sideBarGroups: SideBarGroup[] = [];
  screenWidth: number;

  @ViewChild("sidenav", { static: true })
  private sidenav: MatSidenav;

  ngOnInit(): void {
    if(window.innerWidth <= 700) {
      this.sidenav.close();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    event.target.innerWidth <= 700 ? this.sidenav.close() : this.sidenav.open();
  }

  public toggle() {
    this.sidenav.toggle();
  }

  public setSideBarGroup(sideBarGroups: SideBarGroup[])  {
    this.sideBarGroups = sideBarGroups;
  }

  ngAfterViewInit(): void {
  }
}
