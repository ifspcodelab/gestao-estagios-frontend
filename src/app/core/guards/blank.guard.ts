import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Role } from '../models/enums/role';
import { JwtTokenService } from '../services/jwt-token.service';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class BlankGuard implements CanActivate {
  constructor(
    private localStorageService: LocalStorageService,
    private jwtTokenService: JwtTokenService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const access_token = this.localStorageService.get('access_token');

    this.jwtTokenService.setToken(access_token!);
    const roles: Role[] = this.jwtTokenService.getRoles()!;

    if (this.jwtTokenService.getSubject()) {
      if(this.jwtTokenService.isTokenExpired()) {
        return this.router.navigate(['authentication/login']);
      }
      else {
        if (roles.includes(Role.ROLE_ADMIN)) {
          this.router.navigate(['admin']);
          return true;
        }
        if (roles.includes(Role.ROLE_ADVISOR)) {
          this.router.navigate(['student']);
          return true;
        }
        else {
          this.router.navigate(['student']);
          return true;
        }
      }
    }
    else {
      return this.router.navigate(['authentication/login']);
    }
  }
}
