import { Component, OnInit, ViewChild } from '@angular/core';
import { SidebarComponent } from "../core/components/sidebar/sidebar.component";
import { SidebarService } from "../core/components/sidebar/sidebar.service";

@Component({
  selector: 'app-admin',
  template: `
    <app-toolbar></app-toolbar>
    <app-sidebar #sidebar></app-sidebar>
  `
})
export class AdminComponent implements OnInit {
  @ViewChild('sidebar', { static: true })
  sidebar: SidebarComponent;

  constructor(private sidenavService: SidebarService) { }

  ngOnInit(): void {
    this.sidenavService.setSidebar(this.sidebar)
    this.sidenavService.setSideBarGroup([
      {
        name: "default",
        items: [
          { name: "Estágios", url: "/admin/intership", icon: "directions_run" },
          { name: "Pedidos de orientação", url: "/admin/advisor-request", icon: "forward_to_inbox" },
          { name: "Estudantes", url: "/admin/student", icon: "people" },
          { name: "Orientadores", url: "/admin/advisor", icon: "supervised_user_circle"  }
        ]
      },
      {
        name: "admin",
        items: [
          { name: "Campus", url: "/admin/campus", icon: "home_work" },
          { name: "Departamentos", url: "/admin/department", icon: "meeting_room"  },
          { name: "Cursos", url: "/admin/course", icon: "school"  },
          { name: "Users", url: "/admin/user", icon: "groups"  }
        ]
      }
    ])
  }
}
