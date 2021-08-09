import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from "@angular/material/sidenav";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  @ViewChild("sidenav", { static: true })
  private sidenav: MatSidenav;

  constructor() { }

  ngOnInit(): void {
  }

  public toggle() {
    this.sidenav.toggle();
  }

}
