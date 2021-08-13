import { Injectable } from '@angular/core';
import {SidebarComponent} from "./sidebar.component";
import { SidebarItem } from "./sidebar.item.model";
import { SideBarGroup } from "./sidebar.group.model";


@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private sidebar: SidebarComponent;

  public setSidebar(sidebar: SidebarComponent) {
    this.sidebar = sidebar;
  }

  public toggle(): void {
    this.sidebar.toggle();
  }

  public setSideBarGroup(sideBarGroups: SideBarGroup[]) {
    this.sidebar.setSideBarGroup(sideBarGroups);
  }
}
