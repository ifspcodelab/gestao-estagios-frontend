import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Campus, CampusCreate } from "../models/campus.model";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { EntityUpdateStatus } from '../models/status.model';

@Injectable({
  providedIn: 'root'
})
export class CampusService {
  apiUrl = `${environment.apiUrl}/campuses`;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept-Language': 'pt-BR'
    })
  };
  constructor(private httpClient: HttpClient) { }

  postCampus(campus: CampusCreate): Observable<Campus> {
    return this.httpClient.post<any>(this.apiUrl, campus, this.httpOptions);
  }

  getCampuses(): Observable<Campus[]> {
    return this.httpClient.get<Campus[]>(this.apiUrl, this.httpOptions);
  }

  getCampusById(id: String): Observable<Campus> {
    return this.httpClient.get<Campus>(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  updateCampus(id: String, campus: CampusCreate): Observable<Campus> {
    return this.httpClient.put<Campus>(`${this.apiUrl}/${id}`, campus, this.httpOptions);
  }

  deleteCampus(id: String): Observable<unknown> {
    return this.httpClient.delete(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  patchCampus(id: String, campusUpdateStatus: EntityUpdateStatus): Observable<Campus> {
    return this.httpClient.patch<Campus>(`${this.apiUrl}/${id}`, campusUpdateStatus, this.httpOptions);
  }

}
