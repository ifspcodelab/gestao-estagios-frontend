import { Component, OnInit } from '@angular/core';
import { Course } from "../../../core/models/course.model";
import { CourseService } from 'src/app/core/services/course.service';
import { ActivatedRoute, Router } from "@angular/router";
import { finalize, first, map } from "rxjs/operators";
import { NotificationService } from "../../../core/services/notification.service";
import { ConfirmDialogService } from "../../../core/services/confirm-dialog.service";
import { MatDialog } from "@angular/material/dialog";
import { ProblemDetail } from "../../../core/interfaces/problem-detail.interface";
import { ListItens } from "../../../core/components/content/content-detail/content-detail.component";
import { LoaderService } from "../../../core/services/loader.service";
import { Department } from 'src/app/core/models/department.model';
import { Campus } from 'src/app/core/models/campus.model';
import { CurriculumService } from 'src/app/core/services/curriculum.service';
import { Curriculum } from 'src/app/core/models/curriculum.model';
import { CurriculumCreateComponent } from '../curriculum-create/curriculum-create.component';
import { EntityStatus } from 'src/app/core/models/enums/status';
import { EntityUpdateStatus } from 'src/app/core/models/status.model';

@Component({
  selector: 'app-course-show',
  templateUrl: './course-show.component.html',
  styleUrls: ['./course-show.component.scss']
})
export class CourseShowComponent implements OnInit {
  course: Course;
  curriculums: Curriculum[] = [];
  loading: boolean = true;
  id: string | null;

  constructor(
    private courseService: CourseService,
    private curriculumService: CurriculumService,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService,
    private confirmDialogService: ConfirmDialogService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    /* console.log(this.id); */

    if (this.id) {
      this.loaderService.show();
      this.fetchCourse(this.id);
    }
  }

  handlerFilterSelected(selected: number) {
    if (selected == 1) {
      this.curriculumService.getCurriculums(this.course.id)
      .pipe(first())
      .subscribe(
        curriculums => {
          this.curriculums = curriculums
        },
      )
    }
    if (selected == 2) {
      this.curriculumService.getCurriculums(this.course.id)
      .pipe(
        first(),
        map(curriculum => curriculum.filter(c => c.status === EntityStatus.ENABLED)),
      )
      .subscribe(
        curriculums => {
          this.curriculums = curriculums
        },
      )
    }
    if (selected == 3) {
      this.curriculumService.getCurriculums(this.course.id)
      .pipe(
        first(),
        map(curriculum => curriculum.filter(c => c.status === EntityStatus.DISABLED)),
      )
      .subscribe(
        curriculums => {
          this.curriculums = curriculums
        },
      )
    }
  }

  fetchCourse(id: string) {
    this.courseService.getCourseById(id)
      .pipe(first())
      .subscribe(
        course => {
          this.course = course;
          this.fetchCurriculums(id);
        },
        error => {
          if (error.status >= 400 || error.status <= 499) {
            this.notificationService.error(`Curso não encontrado com id ${this.id}`);
            this.navigateToList();
          }
        }
      )
  }

  fetchCurriculums(courseId: string) {
    this.curriculumService.getCurriculums(courseId)
      .pipe(
        first(),
        finalize(() => {
          this.loaderService.hide();
          this.loading = false;
        })
      )
      .subscribe(
        curriculums => {
          this.curriculums = curriculums
        },
        error => {
          if (error.status >= 400 || error.status <= 499) {
            console.error(error);
            this.notificationService.error(`Error ao carregar matrizes`);
            this.navigateToList();
          }
        }
      )
  }

  handlerDeleteCourse() {
    if (this.curriculums.length != 0) {
      this.notificationService.error('O curso possui matrizes associadas e não pode ser excluído.');
    } else {
      this.deleteCourse();
    }
  }

  deleteCourse() {
    this.curriculumService.getCurriculums(this.course.id)
      .pipe(first())
      .subscribe(
        curriculums => {
          if(curriculums.length > 0) {
            this.notificationService.error('O curso possui matrizes associados e não pode ser excluído.');
            return;
          }

          this.confirmDialogService.confirmRemoval('Curso').subscribe(
            result => {
              if (result) {
                this.courseService.deleteCourse(this.id!)
                  .pipe(first())
                  .subscribe(
                    _ => {
                      this.notificationService.success(`Curso ${this.course.abbreviation} removido com sucesso`);
                      this.navigateToList();
                    },
                    error => {
                      if (error.status === 409) {
                        const problemDetail: ProblemDetail = error.error;
                        if (problemDetail.title == 'Referential integrity exception') {
                          this.notificationService.error('O curso possui matrizes associados e não pode ser excluído.');
                        }
                      }
                    }
                  )
              }
            }
          );
        }
      );
  }

  private getDialogConfig(curriculum?: Curriculum) {
    return {
      autoFocus: true,
      data: {
        course: this.course,
        curriculum: curriculum
      },
    };
  }

  handlerCreateCurriculum() {
    this.dialog.open(CurriculumCreateComponent, this.getDialogConfig(undefined))
      .afterClosed()
      .subscribe(result => {
        if (result) {
          this.curriculums = [...this.curriculums, result]
        }
      });
  }

  handlerUpdateCurriculum(curriculum: Curriculum) {
    this.dialog.open(CurriculumCreateComponent, this.getDialogConfig(curriculum))
      .afterClosed()
      .subscribe(result => {
        if (result) {
          const curriculumFound = this.curriculums.find(c => c.id == result.id);
          if (curriculumFound) {
            curriculumFound.code = result.code;
            curriculumFound.courseLoad = result.courseLoad;
            curriculumFound.internshipCourseLoad = result.internshipCourseLoad;
            curriculumFound.internshipStartCriteria = result.internshipStartCriteria;
            curriculumFound.internshipAllowedActivities = result.internshipAllowedActivities;
          }
        }
      }
      );
  }

  handlerDeleteCurriculum($event: Event, curriculum: Curriculum | null) {
    $event.stopPropagation();
    this.confirmDialogService.confirmRemovalFemaleArticle('Matriz').subscribe(
      result => {
        if (result) {
          this.curriculumService.deleteCurriculum(this.id!, curriculum!.id).subscribe(
            _ => {
              this.curriculums = this.curriculums.filter(c => c.id != curriculum!.id);
              this.notificationService.success(`Matriz ${curriculum!.code} removida com sucesso`);
            }
          );
        }
      }
    );
  }

  navigateToList() {
    this.router.navigate(['admin/course']);
  }

  handleEnabled(curriculum: Curriculum): boolean {
    return curriculum.status == EntityStatus.ENABLED ? true : false;
  }

  toggleCurriculum($event: Event, curriculum: Curriculum) {
    $event.stopPropagation();
    if (curriculum.status === EntityStatus.ENABLED){
      this.curriculumService.patchCurriculum(curriculum.course.id, curriculum.id, new EntityUpdateStatus(EntityStatus.DISABLED))
        .pipe(first())
        .subscribe(
          _ => {
            this.notificationService.success("Matriz desativada com sucesso");
            curriculum.status = EntityStatus.DISABLED;
          }
        )
    } else {
      this.curriculumService.patchCurriculum(curriculum.course.id, curriculum.id, new EntityUpdateStatus(EntityStatus.ENABLED))
        .pipe(first())
        .subscribe(
          _ => {
            this.notificationService.success("Matriz ativada com sucesso");
            curriculum.status = EntityStatus.ENABLED;
          }
        )
    }
  }

  courseDetails(): ListItens {
    const getCampusData = () => {
      const campus: Campus = this.course.department.campus;
      return `Campus: ${campus.name} - ${campus.abbreviation}`;
    }
    const getDepartmentData = () => {
      const department: Department = this.course.department;
      return `Departamento: ${department.name} - ${department.abbreviation}`;
    }
    const getNumberOfPeriodsData = () => {
      return `Períodos: ${this.course.numberOfPeriods}`;
    }
    return {
      itens: [
        {
          icon: 'school', title: 'Dados Curso', lines: [getNumberOfPeriodsData(), getCampusData(), getDepartmentData()]
        }
      ]
    };
  }
}
