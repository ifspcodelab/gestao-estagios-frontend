import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, first } from 'rxjs/operators';
import { ListItens } from 'src/app/core/components/content/content-detail/content-detail.component';
import { Advisor } from 'src/app/core/models/advisor.model';
import { Course } from 'src/app/core/models/course.model';
import { AdvisorService } from 'src/app/core/services/advisor.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-advisor-show',
  templateUrl: './advisor-show.component.html',
  styleUrls: ['./advisor-show.component.scss']
})
export class AdvisorShowComponent implements OnInit {
  advisor: Advisor;
  loading: boolean = true;
  id: string | null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loaderService: LoaderService,
    private advisorService: AdvisorService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');

    if(this.id) {
      this.loaderService.show();
      this.fetchAdvisor(this.id);
    }
  }

  fetchAdvisor(id: string) {
    this.advisorService.getAdvisorById(id)
    .pipe(
      first(),
      finalize(() => {
        this.loaderService.hide();
        this.loading = false;
      })
    )
      .subscribe(
        advisor => {
          this.advisor = advisor;
        },
        error => {
          if(error.status >= 400 || error.status <= 499) {
            this.notificationService.error(`Orientador não encontrado com id ${this.id}`);
            this.navigateToList();
          }
        }
      )
  }

  handlerDeleteAdvisor() {
    return null;
  }

  advisorDetails(): ListItens {
    const getCoursesData = () => {
      const courses: Course[] = this.advisor.courses;
      return courses.map(course => `${course.name}, Câmpus ${course.department.campus.abbreviation}, ${course.department.abbreviation}`)
    }
    return {
      itens: [
        { icon: 'assignment_turned_in', title: 'Cursos que leciona', lines: getCoursesData() }
      ]
    };
  }

  navigateToList() {
    this.router.navigate(['admin/advisor']);
  }

}
