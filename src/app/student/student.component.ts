import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SidebarComponent } from "../core/components/sidebar/sidebar.component";
import { SidebarService } from "../core/components/sidebar/sidebar.service";
import { LoaderService, LoaderState } from "../core/services/loader.service";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-student',
  template: `
    <app-toolbar></app-toolbar>
    <mat-progress-bar mode="indeterminate" *ngIf="show"></mat-progress-bar>
    <app-sidebar #sidebar></app-sidebar>
  `,
  styles:[`
    mat-progress-bar {
     margin-top: -4px;
    }
  `]
})
export class StudentComponent implements OnInit, OnDestroy {
  @ViewChild('sidebar', { static: true })
  sidebar: SidebarComponent;
  show = false;
  private subscription: Subscription;

  constructor(
    private sidenavService: SidebarService,
    private loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    this.subscription = this.loaderService.loaderState.subscribe(
      (state: LoaderState) => {
        setTimeout(() => {
          this.show = state.show;
        }, 50)
      }
    )
    this.sidenavService.setSidebar(this.sidebar)
    this.sidenavService.setSideBarGroup([
      {
        name: "default",
        items: [
          { name: "Estágios", url: "/student/intership", icon: "directions_run" },
          { name: "Pedidos de orientação", url: "/student/advisor-request", icon: "forward_to_inbox" },
        ]
      },
    ])
  }

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
  }
}
