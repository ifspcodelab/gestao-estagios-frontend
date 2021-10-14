import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { LocalStorageService } from '../../services/local-storage.service';
import { JwtTokenService } from '../../services/jwt-token.service';
import { UserService } from '../../services/user.service';
import { SidebarService } from "../sidebar/sidebar.service";
import { finalize, first } from 'rxjs/operators';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  loading: boolean = true;
  user: User;

  constructor(
    private sidenavService: SidebarService,
    private localStorageService: LocalStorageService,
    private jwtTokenService: JwtTokenService,
    private userService: UserService,
    private loaderService: LoaderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loaderService.show();

    this.jwtTokenService.setToken(this.localStorageService.get('access_token')!);
    const registration = this.jwtTokenService.getSubject();

    this.userService.getUserByRegistration(registration!)
      .pipe(
        first(),
        finalize(() => {
          this.loaderService.hide();
          this.loading = false;
        })
      )
      .subscribe(
        user => {
          this.user = user;
        }
      )
  }

  toggleRightSidenav() {
    this.sidenavService.toggle();
  }

  logout() {
    this.localStorageService.remove('access_token');
    this.localStorageService.remove('refresh_token');
    this.router.navigate(['authentication/login']);
  }

}
