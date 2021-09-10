import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize, first } from "rxjs/operators";
import { Course } from 'src/app/core/models/course.model';
import { EntityStatus } from 'src/app/core/models/enums/status';
import { EntityUpdateStatus } from 'src/app/core/models/status.model';
import { CourseService } from 'src/app/core/services/course.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent implements OnInit {
  courses$: Observable<Course[]>;

  constructor(
    private courseService: CourseService,
    private notificationService: NotificationService,
    private loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    this.loaderService.show();
    this.courses$ = this.courseService.getCourses()
      .pipe(
        finalize(() => {
          this.loaderService.hide();
        })
      );
  }

  handleEnabled(course: Course): boolean {
    return course.status == EntityStatus.ENABLED ? true : false;
  }

  toggleCourse($event: Event, course: Course) {
    $event.stopPropagation();
    if (course.status === EntityStatus.ENABLED){
      this.courseService.patchCampus(course.id, new EntityUpdateStatus(EntityStatus.DISABLED))
        .pipe(first())
        .subscribe(
          _ => {
            this.notificationService.success("Curso desativado com sucesso");
            course.status = EntityStatus.DISABLED;
          }
        )
    } else {
      this.courseService.patchCampus(course.id, new EntityUpdateStatus(EntityStatus.ENABLED))
        .pipe(first())
        .subscribe(
          _ => {
            this.notificationService.success("Curso ativado com sucesso");
            course.status = EntityStatus.ENABLED;
          }
        )
    }
  }

}
