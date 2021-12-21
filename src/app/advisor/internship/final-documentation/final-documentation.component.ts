import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { finalize, first } from 'rxjs/operators';
import { InternshipStatus } from 'src/app/core/models/enums/InternshipStatus';
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
  loading: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { internship: Internship },
    private dialogRef: MatDialogRef<RealizationTermAppraisalComponent>,
    private internshipService: InternshipService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
  }

  getDocumentation() {
    this.loading = true;
    this.internshipService.finalDocumentation(this.data.internship.id)
      .pipe(
        first(),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        data => {
          this.internshipService.handleFile(data);
        }
      );
  }

  confirmConsolidation() {
    this.internshipService.updateInternshipStatus(this.data.internship.id)
      .pipe(first())
      .subscribe(
        realizationTerm => {
          this.notificationService.success('Documentação consolidada com sucesso! O estágio foi finalizado.');
          this.dialogRef.close(realizationTerm);
        }
      )
  }

  isInternshipFinished() {
    return this.data.internship.status === InternshipStatus.FINISHED;
  }
}
