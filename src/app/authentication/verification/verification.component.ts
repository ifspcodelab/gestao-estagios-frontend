import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { EntityStatus } from 'src/app/core/models/enums/status';
import { Student } from 'src/app/core/models/student.model';
import { NotificationService } from 'src/app/core/services/notification.service';
import { StudentService } from 'src/app/core/services/student.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss']
})
export class VerificationComponent implements OnInit {
  id: string | null;
  student: Student;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService,
    private studentService: StudentService,
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');

    this.studentService.getStudentById(this.id!).pipe(first())
    .subscribe(
      student => {
        this.student = student;
        if (this.student.user.isActivated === EntityStatus.ENABLED) {
          this.notificationService.error("Conta já verificada.");
          this.router.navigate(['authentication/login']);
        }
        else {
          this.studentService.activateStudent(this.id!)
            .pipe(first())
            .subscribe(
              _ => {
                this.notificationService.success("Conta habilitada com sucesso!");
              }
            )
        }
      }
    )
  }

}
