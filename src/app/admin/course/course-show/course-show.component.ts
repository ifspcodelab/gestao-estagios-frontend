import { Component, OnInit } from '@angular/core';
import { Course } from "../../../core/models/course.model";
import { CourseService } from 'src/app/core/services/course.service';
import { ActivatedRoute, Router } from "@angular/router";
import { finalize, first } from "rxjs/operators";
import { NotificationService } from "../../../core/services/notification.service";
import { ConfirmDialogService } from "../../../core/services/confirm-dialog.service";
import { MatDialog } from "@angular/material/dialog";
/* import { DepartmentCreateComponent } from '../department-create/department-create.component'; */
import { ProblemDetail } from "../../../core/interfaces/problem-detail.interface";
import { ListItens } from "../../../core/components/content/content-detail/content-detail.component";
import { LoaderService } from "../../../core/services/loader.service";
import { Department } from 'src/app/core/models/department.model';
import { Campus } from 'src/app/core/models/campus.model';
import { CurriculumService } from 'src/app/core/services/curriculum.service';
import { Curriculum } from 'src/app/core/models/curriculum.model';

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

  private getDialogConfig(curriculum?: Curriculum) {
    return {
      autoFocus: true,
      data: {
        course: this.course,
        curriculum: curriculum
      }
    };
 }

  /*  handlerCreateDepartment() {
     this.dialog.open(DepartmentCreateComponent, this.getDialogConfig(undefined))
       .afterClosed()
       .subscribe(result => {
         if (result) {
           this.departments = [...this.departments, result]
         }
       });
   } */

  /*   handlerUpdateDepartment(department: Department) {
      this.dialog.open(DepartmentCreateComponent, this.getDialogConfig(department))
        .afterClosed()
        .subscribe(result => {
          if (result) {
            const departmentFound = this.departments.find(d => d.id == result.id);
            if (departmentFound) {
              departmentFound.abbreviation = result.abbreviation;
              departmentFound.name = result.name;
            }
          }
        }
        );
    } */

  handlerDeleteCurriculum($event: Event, curriculum: Curriculum | null) {
    $event.stopPropagation();
    this.confirmDialogService.confirmRemovalFemaleArticle('Matriz').subscribe(
      result => {
        if (result) {
          this.curriculumService.deleteCurriculum(this.id!, curriculum!.id).subscribe(
            _ => {
              this.curriculums = this.curriculums.filter(c => c.id != curriculum!.id);
              this.notificationService.success(`Curriculum ${curriculum!.code} removido com sucesso`);
            }
          );
        }
      }
    );
  }

  navigateToList() {
    this.router.navigate(['admin/course']);
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
        /* {
          icon: 'contact_support', title: 'Setor de Estágio', lines: [
            this.campus.internshipSector.telephone,
            this.campus.internshipSector.email,
            this.campus.internshipSector.website,
          ]
        } */
      ]
    };
  }
}
