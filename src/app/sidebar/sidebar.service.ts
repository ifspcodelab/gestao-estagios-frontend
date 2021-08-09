import { Injectable } from '@angular/core';
import {SidebarComponent} from "./sidebar.component";

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private sidebar: SidebarComponent;

  public setSidebar(sidebar: SidebarComponent) {
    this.sidebar = sidebar;
  }

  public toggle(): void {
    console.log(this.sidebar);
    this.sidebar.toggle();
  }
}
