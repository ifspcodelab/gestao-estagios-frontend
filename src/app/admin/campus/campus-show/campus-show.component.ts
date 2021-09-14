import { Component, OnInit } from '@angular/core';
import { Campus } from "../../../core/models/campus.model";
import { CampusService } from "../../../core/services/campus.service";
import { ActivatedRoute, Router } from "@angular/router";
import { finalize, first, map } from "rxjs/operators";
import { NotificationService } from "../../../core/services/notification.service";
import { ConfirmDialogService } from "../../../core/services/confirm-dialog.service";
import { DepartmentService } from 'src/app/core/services/department.service';
import { Department } from 'src/app/core/models/department.model';
import { MatDialog } from "@angular/material/dialog";
import { DepartmentCreateComponent } from '../department-create/department-create.component';
import { ProblemDetail } from "../../../core/interfaces/problem-detail.interface";
import { ListItens } from "../../../core/components/content/content-detail/content-detail.component";
import { LoaderService } from "../../../core/services/loader.service";
import { Address } from "../../../core/models/address.model";
import { EntityStatus } from 'src/app/core/models/enums/status';
import { EntityUpdateStatus } from 'src/app/core/models/status.model';


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
      this.fetchCampus(this.id);
    }
  }

  handlerFilterSelected(selected: number) {
    if (selected == 1) {
      this.departmentService.getDepartments(this.campus.id)
      .pipe(first())
      .subscribe(
        departments => {
          this.departments = departments
        },
      )
    }
    if (selected == 2) {
      this.departmentService.getDepartments(this.campus.id)
      .pipe(
        first(),
        map(department => department.filter(d => d.status === EntityStatus.ENABLED)),
      )
      .subscribe(
        departments => {
          this.departments = departments
        },
      )
    }
    if (selected == 3) {
      this.departmentService.getDepartments(this.campus.id)
      .pipe(
        first(),
        map(department => department.filter(d => d.status === EntityStatus.DISABLED)),
      )
      .subscribe(
        departments => {
          this.departments = departments
        },
      )
    }
  }

  fetchCampus(id: string) {
    this.campusService.getCampusById(id)
      .pipe(first())
      .subscribe(
        campus => {
          this.campus = campus;
          this.fetchDepartments(id);
        },
        error => {
          if(error.status >= 400 || error.status <= 499) {
            this.notificationService.error(`Campus não encontrado com id ${this.id}`);
            this.navigateToList();
          }
        }
      )
  }

  fetchDepartments(campusId: string) {
    this.departmentService.getDepartments(campusId)
      .pipe(
        first(),
        finalize(() => {
          this.loaderService.hide();
          this.loading = false;
        })
      )
      .subscribe(
        departments => {
          this.departments = departments
        },
        error => {
          if(error.status >= 400 || error.status <= 499) {
            console.error(error);
            this.notificationService.error(`Error ao carregar departamentos`);
            this.navigateToList();
          }
        }
      )
  }

  handlerDeleteCampus() {
    if(this.departments.length != 0) {
      this.notificationService.error('O campus possui departamentos associados e não pode ser excluído.');
    } else {
      this.deleteCampus()
    }
  }

  deleteCampus() {
    this.confirmDialogService.confirmRemoval('Campus').subscribe(
      result => {
        if(result) {
          this.campusService.deleteCampus(this.id!)
            .pipe(first())
            .subscribe(
              _ => {
                this.notificationService.success(`Campus ${this.campus.abbreviation} removido com sucesso`);
                this.navigateToList();
              },
              error => {
                if(error.status === 409) {
                  const problemDetail: ProblemDetail = error.error;
                  if(problemDetail.title == 'Referential integrity exception') {
                    this.notificationService.error('O campus possui departamentos associados e não pode ser excluído.');
                  }
                }
              }
            )
        }
      }
    );
  }

  private getDialogConfig(department?: Department) {
    return {
      autoFocus: true,
      data: {
        campus: this.campus,
        department: department
      }
    };
  }

  handlerCreateDepartment() {
    this.dialog.open(DepartmentCreateComponent, this.getDialogConfig(undefined))
      .afterClosed()
      .subscribe(result => {
        if(result) {
          this.departments = [...this.departments, result]
        }
      });
  }

  handlerUpdateDepartment(department: Department) {
    this.dialog.open(DepartmentCreateComponent, this.getDialogConfig(department))
      .afterClosed()
      .subscribe(result => {
          if(result) {
            const departmentFound = this.departments.find(d => d.id == result.id);
            if(departmentFound) {
              departmentFound.abbreviation = result.abbreviation;
              departmentFound.name = result.name;
            }
          }
        }
      );
  }

  handlerDeleteDepartment($event: Event, department: Department | null) {
    $event.stopPropagation();
    this.confirmDialogService.confirmRemoval('Departamento').subscribe(
      result => {
        if(result) {
          this.departmentService.deleteDepartment(this.id!, department!.id).subscribe(
            _ => {
              this.departments = this.departments.filter(d => d.id != department!.id);
              this.notificationService.success(`Department ${department!.abbreviation} removido com sucesso`);
            }
          );
        }
      }
    );
  }

  navigateToList() {
    this.router.navigate(['admin/campus']);
  }

  handleEnabled(department: Department): boolean {
    return department.status == EntityStatus.ENABLED ? true : false;
  }

  toggleDepartment($event: Event, department: Department) {
    $event.stopPropagation();
    if (department.status === EntityStatus.ENABLED){
      this.departmentService.patchDepartment(department.campus.id, department.id, new EntityUpdateStatus(EntityStatus.DISABLED))
        .pipe(first())
        .subscribe(
          _ => {
            this.notificationService.success("Departamento desativado com sucesso");
            department.status = EntityStatus.DISABLED;
          }
        )
    } else {
      this.departmentService.patchDepartment(department.campus.id, department.id, new EntityUpdateStatus(EntityStatus.ENABLED))
        .pipe(first())
        .subscribe(
          _ => {
            this.notificationService.success("Departamento ativado com sucesso");
            department.status = EntityStatus.ENABLED;
          }
        )
    }
  }

  campusDetails(): ListItens {
    const getAddressData = () => {
      const address: Address = this.campus.address;
      return `${address.street}, ${address.number}, CEP ${address.postalCode}, ${address.city.name}, ${address.city.state.abbreviation}, ${address.neighborhood}`;
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
