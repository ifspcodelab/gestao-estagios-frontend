import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Advisor } from 'src/app/core/models/advisor.model';
import { AdvisorService } from 'src/app/core/services/advisor.service';
import { LoaderService } from 'src/app/core/services/loader.service';

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

}
