import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Internship } from "../models/internship.model";

@Injectable({
    providedIn: 'root'
  })
export class InternshipService {
  apiUrl = `${environment.apiUrl}/internships`;
  apiUrlStudent = `${environment.apiUrl}/students`;
  apiUrlAdvisor = `${environment.apiUrl}/advisors`;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept-Language': 'pt-BR'
    })
  };
  constructor(private httpClient: HttpClient) { }

  getByStudentId(id: string): Observable<Internship[]> {
    return this.httpClient.get<Internship[]>(`${this.apiUrlStudent}/${id}/internships`, this.httpOptions);
  }

  getByAdvisorId(id: string): Observable<Internship[]> {
    return this.httpClient.get<Internship[]>(`${this.apiUrlAdvisor}/${id}/internships`, this.httpOptions);
  }

  getById(id: string): Observable<Internship> {
    return this.httpClient.get<Internship>(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  updateInternshipStatus(id: string): Observable<Internship> {
    return this.httpClient.patch<Internship>(`${this.apiUrl}/${id}/update-status`, this.httpOptions);
  }

  finalDocumentation(id: string) {
    return this.httpClient.get(`${this.apiUrl}/${id}/final-documentation`, {
      responseType: 'blob' as 'json'
    });
  }

  handleFile(res: any) {
    const file = new Blob([res], {
      type: res.type
    });

    

    const blob = window.URL.createObjectURL(file);

    const link = document.createElement('a');
    link.href = blob;
    link.download;

    
    link.dispatchEvent(new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    }));

    setTimeout(() => { // firefox
      window.URL.revokeObjectURL(blob);
      link.remove();
    }, 100);
  }
} 