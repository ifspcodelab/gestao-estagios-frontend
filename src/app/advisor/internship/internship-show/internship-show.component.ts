import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { ListItens } from "../../../core/components/content/content-detail/content-detail.component";
import { NotificationService } from "../../../core/services/notification.service";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: 'app-internship-show',
  templateUrl: './internship-show.component.html',
  styleUrls: ['./internship-show.component.scss']
})
export class InternshipShowComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  createMode: boolean;

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.form = this.buildForm();
  }

  public onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }
  }

  field(path: string) {
    return this.form.get(path)!;
  }

  fieldErrors(path: string) {
    return this.field(path)?.errors;
  }

  buildForm(): FormGroup {
    return this.fb.group({

    });
  }

  internshipDetails(): ListItens {
    const getCompayName = () => {
      // const campus: Campus = this.course.department.campus;
      return `Razão Social: Empresa A`;
    }
    const getInternshipStartDate = () => {
      // const department: Department = this.course.department;
      return `Data de Início: 11/08/2021`;
    }
    const getInternshipEndDate = () => {
      return `Data de Término: 20/12/2021`;
    }
    const getFile = () => {
      return `www.teste.com.br`;
    }
    return {
      itens: [
        {
          icon: 'description', title: 'Dados', lines: [ getCompayName(), getInternshipStartDate(), getInternshipEndDate()]
        },
        {
          icon: 'picture_as_pdf', title: 'Link', lines: [getFile()]
        }
      ]
    };
  }

  // private getDialogConfig(deferred: boolean) {
  //   return {
  //     autoFocus: true,
  //     data: {
  //       deferred: deferred,
  //       ?????: this.id
  //     }
  //   };
  // }
  //
  // handlerCreateAppraisal(deferred: boolean) {
  //   if (this.?????.status === RequestStatus.PENDING) {
  //     this.dialog.open(RequestAppraisalCreateComponent, this.getDialogConfig(deferred));
  //   }
  //   else {
  //     this.notificationService.error('Não é possível avaliar o plano de atividades novamente!');
  //   }
  // }

  getBackUrl(): string {
    return this.createMode ? '/advisor/internship' : `/advisor/internship/1234`;
  }

}
