import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize, first } from 'rxjs/operators';
import { Advisor } from 'src/app/core/models/advisor.model';
import { EntityStatus } from 'src/app/core/models/enums/status';
import { EntityUpdateStatus } from 'src/app/core/models/status.model';
import { AdvisorService } from 'src/app/core/services/advisor.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-advisor-list',
  templateUrl: './advisor-list.component.html',
  styleUrls: ['./advisor-list.component.scss']
})
export class AdvisorListComponent implements OnInit {
  advisors$: Observable<Advisor[]>

  constructor(
    private advisorService: AdvisorService,
    private loaderService: LoaderService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loaderService.show();
    this.advisors$ = this.advisorService.getAdvisors()
      .pipe(
        finalize(() => {
          this.loaderService.hide();
        })
    );
  }

  handleEnabled(advisor: Advisor) {
    return advisor.user.isActivated == EntityStatus.ENABLED ? true : false;
  }

  toggleAdvisor($event: Event, advisor: Advisor) {
    $event.stopPropagation();
    if (advisor.user.isActivated === EntityStatus.ENABLED){
      this.advisorService.patchAdvisor(advisor.id, new EntityUpdateStatus(EntityStatus.DISABLED))
        .pipe(first())
        .subscribe(
          _ => {
            this.notificationService.success("Campus desativado com sucesso");
            advisor.user.isActivated = EntityStatus.DISABLED;
          }
        )
    } else {
      this.advisorService.patchAdvisor(advisor.id, new EntityUpdateStatus(EntityStatus.ENABLED))
        .pipe(first())
        .subscribe(
          _ => {
            this.notificationService.success("Orientador ativado com sucesso");
            advisor.user.isActivated = EntityStatus.ENABLED;
          }
        )
    }
  }

}
