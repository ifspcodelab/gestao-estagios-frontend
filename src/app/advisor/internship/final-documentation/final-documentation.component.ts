import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InternshipService } from 'src/app/core/services/internship.service';

@Component({
  selector: 'app-final-documentation',
  templateUrl: './final-documentation.component.html',
  styleUrls: ['./final-documentation.component.scss']
})
export class FinalDocumentationComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { internshipId: string },
    private internshipService: InternshipService,
  ) { }

  ngOnInit(): void {
  }

  getDocumentation() {
    this.internshipService.finalDocumentation(this.data.internshipId)
      .subscribe(
        data => {
          console.log(data);
          this.internshipService.handleFile(data);
        }
      );
  }

  // getDocumentation() {
  //   window.open('http://localhost:8080/api/v1/internships/708af3e2-f02e-4f2e-b01b-0757a7ac5728/final-documentation', "_blank");
  // }

  getFileNameFromHttpResponse(httpResponse: any) {
    var contentDispositionHeader = httpResponse.headers.get('content-disposition');
    var result = contentDispositionHeader.split(';')[1].trim().split('=')[1];
    return result.replace(/"/g, '');
  }
}
