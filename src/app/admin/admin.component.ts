import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SidebarComponent } from "../core/components/sidebar/sidebar.component";
import { SidebarService } from "../core/components/sidebar/sidebar.service";
import { LoaderService, LoaderState } from "../core/services/loader.service";
import { Subscription } from "rxjs";
import { LocalStorageService } from '../core/services/local-storage.service';
import { JwtTokenService } from '../core/services/jwt-token.service';
import { Role } from '../core/models/enums/role';
import { SideBarGroup } from '../core/components/sidebar/sidebar.group.model';

@Component({
  selector: 'app-admin',
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
export class AdminComponent implements OnInit, OnDestroy {
  @ViewChild('sidebar', { static: true })
  sidebar: SidebarComponent;
  show = false;
  private subscription: Subscription;

  constructor(
    private sidenavService: SidebarService,
    private loaderService: LoaderService,
    private localStorageService: LocalStorageService,
    private jwtTokenService: JwtTokenService,
  ) { }

  ngOnInit(): void {
    this.subscription = this.loaderService.loaderState.subscribe(
      (state: LoaderState) => {
        setTimeout(() => {
          this.show = state.show;
        }, 50)
      }
    )

    const access_token = this.localStorageService.get('access_token');
    this.jwtTokenService.setToken(access_token!);
    const roles: Role[] = this.jwtTokenService.getRoles()!;

    let sideBarGroup: SideBarGroup[] = [{
      name: "admin",
      items: [
        { name: "Campus", url: "/admin/campus", icon: "home_work" },
        { name: "Cursos", url: "/admin/course", icon: "school"  },
        { name: "Parâmetros", url: "/admin/parameter", icon: "manage_accounts"  },
      ]
    }];

    if (roles.includes(Role.ROLE_ADVISOR)) {
      sideBarGroup.push({
        name: "default",
        items: [
          { name: "Estágios", url: "/advisor/internship", icon: "directions_run" },
          { name: "Pedidos de orientação", url: "/advisor/advisor-request", icon: "forward_to_inbox" },
          { name: "Estudantes", url: "/advisor/student", icon: "people" },
          { name: "Orientadores", url: "/advisor/advisor", icon: "supervised_user_circle"  }
        ]
      })
      sideBarGroup.reverse();
    }

    this.sidenavService.setSidebar(this.sidebar)
    this.sidenavService.setSideBarGroup(
      // {
      //   name: "default",
      //   items: [
      //     { name: "Estágios", url: "/admin/internship", icon: "directions_run" },
      //     { name: "Pedidos de orientação", url: "/admin/advisor-request", icon: "forward_to_inbox" },
      //     { name: "Estudantes", url: "/admin/student", icon: "people" },
      //     { name: "Orientadores", url: "/admin/advisor", icon: "supervised_user_circle"  }
      //   ]
      // },
      // {
      //   name: "admin",
      //   items: [
      //     { name: "Campus", url: "/admin/campus", icon: "home_work" },
      //     // { name: "Departamentos", url: "/admin/department", icon: "meeting_room"  },
      //     { name: "Cursos", url: "/admin/course", icon: "school"  },
      //     // { name: "Usuários", url: "/admin/user", icon: "groups"  }
      //     { name: "Parâmetros", url: "/admin/parameter", icon: "manage_accounts"  },
      //   ]
      // }
      sideBarGroup
    )
  }

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
  }
}
