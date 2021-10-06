import { Injectable } from "@angular/core";
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class JwtTokenService {

  jwtToken: string;
  decodedToken: { [key: string]: string };

  constructor() { }

  setToken(token: string) {
    if (token) this.jwtToken = token;
  }

  decodeToken() {
    if (this.jwtToken) this.decodedToken = jwt_decode(this.jwtToken);
  }

  getDecodedToken() {
    return jwt_decode(this.jwtToken);
  }

  getSubject() {
    this.decodeToken();
    return this.decodedToken ? this.decodedToken.sub : null;
  }

  getRoles(): any {
    this.decodeToken();
    return this.decodedToken ? this.decodedToken.roles : null;
  }

  getExpiryTime(): any {
    this.decodeToken();
    return this.decodedToken ? this.decodedToken.exp : null;
  }

  isTokenExpired(): boolean {
    const expiryTime: number = this.getExpiryTime();
    if (expiryTime) {
      return ((1000 * expiryTime) - (new Date()).getTime()) < 5000;
    } else {
      return false;
    }
  }
}