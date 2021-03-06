import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { User, UserPasswordReset, UserRedefinePassword, UserUpdate } from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiUrl = `${environment.apiUrl}/users`;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept-Language': 'pt-BR'
    })
  };
  constructor(private httpClient: HttpClient) { }

  getUserByRegistration(registration: String): Observable<User> {
    return this.httpClient.get<User>(`${this.apiUrl}/${registration}`, this.httpOptions);
  }

  updateUser(id: string, userUpdate: UserUpdate): Observable<User> {
    return this.httpClient.put<User>(`${this.apiUrl}/${id}`, userUpdate, this.httpOptions);
  }

  sendEmailPassword(userPasswordReset: UserPasswordReset): Observable<User> {
    return this.httpClient.post<User>(`${this.apiUrl}/${userPasswordReset.registration}`, this.httpOptions);
  }

  redefinePassword(id: string, userRedefinePassword: UserRedefinePassword): Observable<unknown> {
    return this.httpClient.patch<unknown>(`${this.apiUrl}/${id}/redefine`, userRedefinePassword, this.httpOptions);
  }
}