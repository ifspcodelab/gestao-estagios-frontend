import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { first } from 'rxjs/operators';
import { Internship } from 'src/app/core/models/internship.model';
import { InternshipService } from 'src/app/core/services/internship.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { RealizationTermAppraisalComponent } from '../realization-term-appraisal/realization-term-appraisal.component';

@Component({
  selector: 'app-final-documentation',
  templateUrl: './final-documentation.component.html',
  styleUrls: ['./final-documentation.component.scss']
})
export class FinalDocumentationComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { internship: Internship },
    private dialogRef: MatDialogRef<RealizationTermAppraisalComponent>,
    private internshipService: InternshipService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
  }

  getDocumentation() {
    this.internshipService.finalDocumentation(this.data.internship.id)
      .subscribe(
        data => {
          this.internshipService.handleFile(data);
        }
      );
  }

  confirmConsolidation(){
    this.internshipService.updateInternshipStatus(this.data.internship.id)
    .pipe(first())
      .subscribe(
        realizationTerm => {
          this.notificationService.success('Estágio marcado como finalizado com sucesso!');
          this.dialogRef.close(realizationTerm);
        }
      )
  }
}
