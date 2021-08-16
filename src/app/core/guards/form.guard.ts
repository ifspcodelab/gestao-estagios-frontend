import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ConfirmDialogComponent } from "../components/confirm-dialog/confirm-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { CanBeSave } from "../interfaces/can-be-save.interface";

@Injectable({
  providedIn: 'root'
})
export class FormGuard implements CanDeactivate<CanBeSave> {
  constructor(private dialog: MatDialog) {
  }
  canDeactivate(
    component: CanBeSave,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if(component.isDataSaved()) {
      return of(true);
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        name: 'Descartar dados?',
        text: 'Os dados do formulário ainda não foram salvos. Considere salvar antes de sair.',
        cancelText: 'Continuar no formulário',
        okText: 'Descartar dados'
      }
    });
    return dialogRef.afterClosed();

  }
}
