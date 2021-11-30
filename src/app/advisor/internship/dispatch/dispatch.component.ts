import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Parameter } from "../../../core/models/parameter.model";
import { FormGroup } from "@angular/forms";
import { NotificationService } from "../../../core/services/notification.service";
import {Internship} from "../../../core/models/internship.model";
import {ActivityPlan} from "../../../core/models/activity-plan.model";
import {DatePipe, formatDate} from "@angular/common";

@Component({
  selector: 'app-dispatch',
  templateUrl: './dispatch.component.html',
  styleUrls: ['./dispatch.component.scss']
})
export class DispatchComponent implements OnInit {
  form: FormGroup;
  replacedDispatch: string;

  constructor(
    private notificationService: NotificationService,
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: { parameter: Parameter, internship: Internship, activityPlan: ActivityPlan, date: Date }
  ) { }

  ngOnInit(): void {
    const currentDate = new Date()
    const formatter = new Intl.DateTimeFormat('pt-BR', { month: 'long' });
    const currentMonthName = formatter.format(new Date());

    // let advisorCourses = "alo";
    //
    // this.data.internship.advisorRequest.advisor.courses.forEach(e => {
    //   advisorCourses += e.name;
    // });

    this.replacedDispatch = this.data.parameter.initialDispatchHtml
      .replace(new RegExp(/\$STUDENTNAME/g), this.data.internship.advisorRequest.student.user.name)
      .replace(new RegExp(/\$REGISTRATION/g), this.data.internship.advisorRequest.student.user.registration)
      .replace(new RegExp(/\$COURSENAME/g), this.data.internship.advisorRequest.curriculum.course.name)
      // .replace(new RegExp(/\$INTERNSHIPTYPE/g), this.data.internship.internshipType.toString())
      .replace(new RegExp(/\$COMPANYNAME/g), this.data.activityPlan.companyName)
      .replace(new RegExp(/\$INTERNSHIPSTARTDATE/g), this.data.activityPlan.internshipStartDate)
      .replace(new RegExp(/\$INTERNSHIPENDDATE/g), this.data.activityPlan.internshipEndDate)
      // .replace(new RegExp(/\$INTERNSHIPSTARTDATE/g), `${this.data.activityPlan.internshipStartDate.toString(), this.datePipe.transform('dd/MM/yyyy')}`)
      // .replace(new RegExp(/\$INTERNSHIPENDDATE/g), `${this.data.activityPlan.internshipEndDate.toString(), this.datePipe.transform('dd/MM/yyyy')}`)
      // .replace(new RegExp(/\$REQUIRED/g), )
      // .replace(new RegExp(/\$NOTREQUIRED/g), )
      .replace(new RegExp(/\$TODAY/g), currentDate.getDate().toString())
      .replace(new RegExp(/\$MONTH/g), currentMonthName)
      .replace(new RegExp(/\$YEAR/g), currentDate.getFullYear().toString())
      // .replace(new RegExp(/\$ADVISORCOURSES/g), advisorCourses)
      .replace(new RegExp(/\$ADVISORNAME/g), this.data.internship.advisorRequest.advisor.user.name)
      .replace(new RegExp(/\$ADVISOREMAIL/g), this.data.internship.advisorRequest.advisor.user.email)
  }

  copyCode(val: string){
    let textBox = document.createElement('textarea');
    textBox.style.position = 'fixed';
    textBox.style.left = '0';
    textBox.style.top = '0';
    textBox.style.opacity = '0';
    textBox.value = val;
    document.body.appendChild(textBox);
    textBox.select();

    document.execCommand('copy');
    this.notificationService.success("Texto copiado para área de transferência!");
  }
}
