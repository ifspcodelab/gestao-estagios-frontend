import { Component, OnInit } from '@angular/core';
import { User } from "../../core/models/user.model";
import { ListItens } from "../../core/components/content/content-detail/content-detail.component";
import { Course } from "../../core/models/course.model";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  user: User;
  loading: boolean = true;
  course: Course;

  constructor(

  ) { }

  ngOnInit(): void {
  }

  userDetails(): ListItens {
    return {
      itens: [
        { icon: 'person', title: 'Dados Pessoais', lines: [
            this.user.name,
            this.user.email,
            this.user.registration,
          ]
        },
        { icon: 'school', title: 'Dados do Campus', lines: [
            this.course.department.campus.name,
            this.course.department.name,
            this.course.name,
          ]
        }
      ]
    };
  }
}
