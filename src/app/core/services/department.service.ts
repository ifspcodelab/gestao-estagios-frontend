import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Campus } from "../models/campus.model";
import { CampusService } from './campus.service';
import { Department } from '../models/department.model';
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { EntityUpdateStatus } from '../models/status.model';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  readonly apiUrl = `${environment.apiUrl}/campuses`;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept-Language': 'pt-BR'
    }),
  };
  constructor(private httpClient: HttpClient) { }

  postDepartments(campusId: string, department: Department): Observable<Department> {
    const url = `${this.apiUrl}/${campusId}/departments`;
    return this.httpClient.post<Department>(url, department, this.httpOptions);
  }

  getDepartments(campusId: string): Observable<Department[]> {
    const url = `${this.apiUrl}/${campusId}/departments`;
    return this.httpClient.get<Department[]>(url, this.httpOptions).pipe(
      map(results => results.sort((a, b) => a.name.localeCompare(b.name)))
    );
  }

  putDepartment(campusId: string, departmentId: string, department: Department): Observable<Department> {
    const url = `${this.apiUrl}/${campusId}/departments/${departmentId}`;
    return this.httpClient.put<Department>(url, department, this.httpOptions);
  }

  deleteDepartment(campusId: string, departmentId: string): Observable<unknown> {
    const url = `${this.apiUrl}/${campusId}/departments/${departmentId}`;
    return this.httpClient.delete(url, this.httpOptions);
  }

  patchDepartment(campusId: string, idDepartment: string, departmentUpdateStatus: EntityUpdateStatus): Observable<Department> {
    return this.httpClient.patch<Department>(`${this.apiUrl}/${campusId}/departments/${idDepartment}`, departmentUpdateStatus, this.httpOptions);
  }
}
