import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { City } from "../models/city.model";

@Injectable({
    providedIn: 'root'
})
export class CityService {
    apiUrl = `${environment.apiUrl}/states`

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };

    constructor(private httpClient: HttpClient) { }

    getCities(stateAbbreviation: string): Observable<City[]> {
        const url = `${this.apiUrl}/${stateAbbreviation}/cities`;
        return this.httpClient.get<City[]>(url, this.httpOptions)
    }

    
}
