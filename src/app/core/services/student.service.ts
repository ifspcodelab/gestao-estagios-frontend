import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Student, UserStudentCreate } from "../models/student.model";

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  apiUrl = `${environment.apiUrl}/students`;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept-Language': 'pt-BR'
    })
  };
  constructor(private httpClient: HttpClient) { }

  postStudent(student: UserStudentCreate): Observable<Student> {
    return this.httpClient.post<Student>(this.apiUrl, student, this.httpOptions);
  }
}