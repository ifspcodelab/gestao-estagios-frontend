import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import {MatSidenav} from "@angular/material/sidenav";
import { SideBarGroup } from "./sidebar.group.model";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, AfterViewInit {
  sideBarGroups: SideBarGroup[] = [];

  @ViewChild("sidenav", { static: true })
  private sidenav: MatSidenav;

  constructor() { }

  ngOnInit(): void {

  }

  public toggle() {
    this.sidenav.toggle();
  }

  public setSideBarGroup(sideBarGroups: SideBarGroup[])  {
    this.sideBarGroups = sideBarGroups;
  }

  ngAfterViewInit(): void {
    console.log(this.setSideBarGroup);
  }
}
