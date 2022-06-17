import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { Observable, of } from 'rxjs';
import { catchError, finalize, first, retry } from "rxjs/operators";
import { FilterDialogComponent } from 'src/app/core/components/filter-dialog/filter-dialog.component';
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
  selectedFilter: number = 1;
  filterNames: string[] = ['Todos', 'Habilitados', 'Desabilitados'];
  errorMessage: string = "";

  constructor(
    private courseService: CourseService,
    private notificationService: NotificationService,
    private loaderService: LoaderService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loaderService.show();
    this.courses$ = this.courseService.getCourses()
      .pipe(
        retry(1),
        catchError(() => {
          this.notificationService.error("Erro ao carregar os cursos");
          return of([]);
        }),
        finalize(() => {
          this.loaderService.hide();
        })
      );
  }

  private getDialogConfig() {
    return {
      autoFocus: true,
      data: {
        filterNames: this.filterNames,
        onChange: ($event: MatRadioChange) => {
          this.selectedFilter = $event.value;
        },
        handleFilter: () => {
          if (this.selectedFilter == 1) {
            this.loaderService.show();
            this.courses$ = this.courseService.getCourses()
              .pipe(
                finalize(() => {
                  this.loaderService.hide();
                })
              );
          }
          if (this.selectedFilter == 2) {
            this.loaderService.show();
            this.courses$ = this.courseService.getAllCoursesByStatus(EntityStatus.ENABLED)
              .pipe(
                finalize(() => {
                  this.loaderService.hide();
                })
              );
          }
          if (this.selectedFilter == 3) {
            this.loaderService.show();
            this.courses$ = this.courseService.getAllCoursesByStatus(EntityStatus.DISABLED)
              .pipe(
                finalize(() => {
                  this.loaderService.hide();
                })
              );
          }
          this.dialog.closeAll();
        },
        selected: this.selectedFilter
      }
    };
  }

  openDialog() {
    this.dialog.open(FilterDialogComponent, this.getDialogConfig())
     .afterClosed()
  }

  handleEnabled(course: Course): boolean {
    return course.status == EntityStatus.ENABLED;
  }

  toggleCourse($event: Event, course: Course) {
    $event.stopPropagation();
    if (course.status === EntityStatus.ENABLED){
      this.courseService.patchCourse(course.id, new EntityUpdateStatus(EntityStatus.DISABLED))
        .pipe(first())
        .subscribe(
          _ => {
            this.notificationService.success("Curso desativado com sucesso");
            course.status = EntityStatus.DISABLED;
          }
        )
    } else {
      this.courseService.patchCourse(course.id, new EntityUpdateStatus(EntityStatus.ENABLED))
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
