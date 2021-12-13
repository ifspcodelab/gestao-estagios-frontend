import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import {MatSidenav} from "@angular/material/sidenav";
import { SideBarGroup } from "./sidebar.group.model";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  sideBarGroups: SideBarGroup[] = [];
  screenWidth: number;
  desktopBreakpoint: number = 700;

  @ViewChild("sidenav", { static: true })
  private sidenav: MatSidenav;

  isDesktop() {
    return this.screenWidth > this.desktopBreakpoint;
  }

  updateSidenavState(innerWidth: number) {
    this.screenWidth = innerWidth;
    this.isDesktop() ? this.sidenav.open() : this.sidenav.close();
  }

  ngOnInit(): void {
    this.updateSidenavState(window.innerWidth);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    event.stopPropagation();
    this.updateSidenavState(event.target.innerWidth);
  }

  public toggle() {
    this.sidenav.toggle();
  }

  public setSideBarGroup(sideBarGroups: SideBarGroup[])  {
    this.sideBarGroups = sideBarGroups;
  }
}
