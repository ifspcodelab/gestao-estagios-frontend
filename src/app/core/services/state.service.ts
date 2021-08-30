import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { State } from '../models/state.model';
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class StateService {
    readonly apiUrl = `${environment.apiUrl}/states`;

    httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
    };

    constructor(private httpClient: HttpClient) { }

    getStates(): Observable<State[]> {
        return this.httpClient.get<State[]>(this.apiUrl, this.httpOptions);
    }
}
