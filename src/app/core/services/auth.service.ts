import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { TokenResponse } from "../models/token.model";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  apiUrl = `${environment.apiUrl}/login`;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept-Language': 'pt-BR'
    })
  };
  constructor(private httpClient: HttpClient) { }

  login(registration: string, password: string): Observable<TokenResponse> {
    return this.httpClient.post<TokenResponse>(this.apiUrl, { registration, password }, this.httpOptions);
  }

}