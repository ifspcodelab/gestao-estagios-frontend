import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Role } from '../models/enums/role';
import { JwtTokenService } from '../services/jwt-token.service';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private localStorageService: LocalStorageService,
    private jwtTokenService: JwtTokenService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const access_token = this.localStorageService.get('access_token');

    console.log(route);
    if (route.url.find(r => r.path == "admin")) {
      console.log('oi');
    }

    this.jwtTokenService.setToken(access_token!);
    const roles: Role[] = this.jwtTokenService.getRoles()!;

    if (this.jwtTokenService.getSubject()) {
      if(this.jwtTokenService.isTokenExpired()) {
        return this.router.navigate(['authentication/login']);
      }
      else {
        if (!roles.includes(Role.ROLE_ADMIN)) {
          return this.router.navigate(['authentication/login']);
        }
        return true;
      }
    }
    else {
      return this.router.navigate(['authentication/login']);
    }
  }
}
