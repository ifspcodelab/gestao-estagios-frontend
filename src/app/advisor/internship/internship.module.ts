import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';
import { InternshipComponent } from "./internship.component";
import { InternshipListComponent } from "./internship-list/internship-list.component";
import { InternshipRoutingModule } from "./internship-routing.module";
import { InternshipShowComponent } from './internship-show/internship-show.component';
import { ActivityPlanAppraisalComponent } from './activity-plan-appraisal/activity-plan-appraisal.component';
import { DraftMonthlyReportListComponent } from './draft-monthly-report-list/draft-monthly-report-list.component';
import { DraftMonthlyReportAppraisalComponent } from './draft-monthly-report-appraisal/draft-monthly-report-appraisal.component';
import { FinalMonthlyReportListComponent } from './final-monthly-report-list/final-monthly-report-list.component';
import { FinalMonthlyReportAppraisalComponent } from './final-monthly-report-appraisal/final-monthly-report-appraisal.component';
import { RealizationTermAppraisalComponent } from './realization-term-appraisal/realization-term-appraisal.component';
import { DispatchComponent } from './dispatch/dispatch.component';
import { FinalDocumentationComponent } from './final-documentation/final-documentation.component';

@NgModule({
  declarations: [
    InternshipComponent,
    InternshipListComponent,
    InternshipShowComponent,
    ActivityPlanAppraisalComponent,
    DraftMonthlyReportListComponent,
    DraftMonthlyReportAppraisalComponent,
    FinalMonthlyReportListComponent,
    FinalMonthlyReportAppraisalComponent,
    RealizationTermAppraisalComponent,
    DispatchComponent,
    FinalDocumentationComponent,
  ],
  imports: [
    CommonModule,
    InternshipRoutingModule,
    SharedModule,
    CoreModule,
  ]
})
export class InternshipModule { }
