import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Role } from '../models/enums/role';
import { JwtTokenService } from '../services/jwt-token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationGuard implements CanActivate {
  constructor(
    private jwtTokenService: JwtTokenService,
    private router: Router
  ) { }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const access_token = localStorage.getItem('access_token');

    this.jwtTokenService.setToken(access_token!);
    const roles: string[] = this.jwtTokenService.getRoles();

    if (this.jwtTokenService.getSubject()) {
      if(this.jwtTokenService.isTokenExpired()) {
        this.router.navigate(['authentication/login']);
        return false;
      }
      else {
        if (roles.includes(Role.ROLE_ADMIN.toString())) {
          return true;
        }
        else {
          this.router.navigate(['authentication/registration']);
          return false;
        }
      }
    }
    else {
      return false;
    }
  }
}
