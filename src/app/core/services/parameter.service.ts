import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import {Parameter, ParameterCreate} from "../models/parameter.model";

@Injectable({
  providedIn: 'root'
})
export class ParameterService {
  apiUrl = `${environment.apiUrl}/parameters`;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept-Language': 'pt-BR'
    })
  };
  constructor(private httpClient: HttpClient) { }

  getParameters(): Observable<Parameter> {
    return this.httpClient.get<Parameter>(this.apiUrl, this.httpOptions);
  }

  updateParameters(parameterCreate: ParameterCreate): Observable<Parameter> {
    return this.httpClient.put<Parameter>(this.apiUrl, parameterCreate, this.httpOptions);
  }
}

