import { Component, OnInit } from '@angular/core';
import { InternshipService } from 'src/app/core/services/internship.service';

@Component({
  selector: 'app-final-documentation',
  templateUrl: './final-documentation.component.html',
  styleUrls: ['./final-documentation.component.scss']
})
export class FinalDocumentationComponent implements OnInit {

  constructor(
    private internshipService: InternshipService,
  ) { }

  ngOnInit(): void {
  }

  getDocumentation() {
    this.internshipService.finalDocumentation('708af3e2-f02e-4f2e-b01b-0757a7ac5728')
        .subscribe(data => {
          this.internshipService.handleFile(data);
        });
  }

}
