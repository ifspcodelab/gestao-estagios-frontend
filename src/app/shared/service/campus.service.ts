import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Campus } from "../model/campus.model";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CampusService {
  apiUrl = 'http://localhost:8080/api/v1/campuses';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  constructor(private httpClient: HttpClient) { }

  postCampus(campus: any): Observable<Campus> {
    return this.httpClient.post<any>(this.apiUrl, campus, this.httpOptions);
  }
}
