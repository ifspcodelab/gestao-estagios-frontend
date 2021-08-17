import { Injectable } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "../components/confirm-dialog/confirm-dialog.component";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {

  constructor(private dialog: MatDialog) { }

  confirm(): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        name: 'Excluir',
        text: 'Deseja realmente excluir?',
        cancelText: 'Cancelar',
        okText: 'Sim'
      }
    });
    return dialogRef.afterClosed();
  }
}
