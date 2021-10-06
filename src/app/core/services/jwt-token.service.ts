import { Injectable } from "@angular/core";
import jwt_decode from 'jwt-decode';
import { TokenData } from "../interfaces/token-data.interface";
import { Role } from "../models/enums/role";

@Injectable({
  providedIn: 'root'
})
export class JwtTokenService {

  jwtToken: string;
  decodedToken: TokenData;

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

  getRoles(): Role[] | null {
    this.decodeToken();
    return this.decodedToken ? this.decodedToken.roles : null;
  }

  getExpiryTime(): number | null {
    this.decodeToken();
    return this.decodedToken ? this.decodedToken.exp : null;
  }

  isTokenExpired(): boolean {
    const expiryTime: number | null = this.getExpiryTime();
    if (expiryTime) {
      return ((1000 * expiryTime) - (new Date()).getTime()) < 5000;
    } else {
      return false;
    }
  }
}