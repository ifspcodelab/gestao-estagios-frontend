import { Component, OnInit } from '@angular/core';
import { Campus } from "../../../core/models/campus.model";
import { CampusService } from "../../../core/services/campus.service";
import { ActivatedRoute, Router } from "@angular/router";
import { finalize } from "rxjs/operators";
import { HttpErrorResponse } from "@angular/common/http";
import { NotificationService } from "../../../core/services/notification.service";
import { ConfirmDialogService } from "../../../core/services/confirm-dialog.service";
import { DepartmentService } from 'src/app/core/services/department.service';
import { Department } from 'src/app/core/models/department.model';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { DepartmentCreateComponent } from '../department-create/department-create.component';
import { ProblemDetail } from "../../../core/interfaces/problem-detail.interface";
import { ListItens } from "../../../core/components/content/content-detail/content-detail.component";
import { LoaderService } from "../../../core/services/loader.service";
import { Address } from "../../../core/models/address.model";


@Component({
  selector: 'app-campus-show',
  templateUrl: './campus-show.component.html',
  styleUrls: ['./campus-show.component.scss']
})
export class CampusShowComponent implements OnInit {
  campus: Campus;
  departments: Department[] = [];
  loading: boolean = true;
  id: string | null;

  constructor(
    private campusService: CampusService,
    private departmentService: DepartmentService,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService,
    private confirmDialogService: ConfirmDialogService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');

    if(this.id) {
      this.loaderService.show();
      this.getCampus(this.id);
    }
  }

  openDialog(department: Department | null) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      campusId: this.campus.id,
      department: department,
      campusAbbreviation: this.campus.abbreviation,
    };

    const dialogRef = this.dialog.open(DepartmentCreateComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(department => {
      if (department) {
        const departmentFound = this.departments.find(d => d.id == department.id);
        if (departmentFound) {
          departmentFound.abbreviation = department.abbreviation;
          departmentFound.name = department.name;
        }
        else {
          this.departments.push(department);
        }
      }
    })
  }

  getCampus(id: string) {
    this.campusService.getCampusById(id)
      .pipe(
        finalize(() => {
          this.loaderService.hide();
          this.loading = false;
        })
      )
      .subscribe(
        campus => {
          this.campus = campus;
          this.getDepartments(id);
        },
        error => this.handleError(error)
      )
  }

  getDepartments(campusId: string) {
    this.departmentService.getDepartments(campusId).subscribe(
      departments => {
        this.departments = departments
      }
    )
  }

  handleError(error: any) {
    if (error instanceof HttpErrorResponse) {
      const problemDetail: ProblemDetail = error.error;

      if(error.status === 404) {
        this.notificationService.error(`Campus não encontrado com id ${this.id}`);
        this.navigateToList();
      }
      if(error.status === 409) {
        if(problemDetail.title == 'Referential integrity exception') {
          this.notificationService.error('O campus possui departamentos associados e não pode ser excluído.');
        }
      }
    }
  }

  delete() {
    this.confirmDialogService.confirmRemoval('Campus').subscribe(
      result => {
        if(result) {
          this.campusService.deleteCampus(this.id!).subscribe(
            result => {
              console.log(result);
              this.notificationService.success(`Campus ${this.campus.abbreviation} removido com sucesso`);
              this.navigateToList();
            },
            error => this.handleError(error)
          )
        }
      }
    )
  }

  deleteDepartment($event: Event, department: Department | null) {
    $event.stopPropagation();
    this.confirmDialogService.confirmRemoval('Departamento').subscribe(
      result => {
        if(result) {
          this.departmentService.deleteDepartment(this.id!, department!.id).subscribe(
            result => {
              this.departments = this.departments.filter(d => d.id != department!.id);
              this.notificationService.success(`Department ${department!.abbreviation} removido com sucesso`);
            },
            error => this.handleError(error)
          )
        }
      }
    )
  }

  navigateToList() {
    this.router.navigate(['admin/campus']);
  }

  campusDetails(): ListItens {
    const getAddressData = () => {
      const address: Address = this.campus.address;
      return `${address.street}, ${address.number}, CEP ${address.postalCode}, ${address.city}, ${address.state}, ${address.neighborhood}`
    }
    return {
      itens: [
        { icon: 'place', title: 'Endereço', lines: [getAddressData()]
        },
        { icon: 'contact_support', title: 'Setor de Estágio', lines: [
            this.campus.internshipSector.telephone,
            this.campus.internshipSector.email,
            this.campus.internshipSector.website,
          ]
        }
      ]
    };
  }
}
