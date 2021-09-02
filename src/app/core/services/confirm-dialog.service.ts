import { Injectable } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "../components/confirm-dialog/confirm-dialog.component";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {

  constructor(private dialog: MatDialog) { }

  confirmRemoval(entity: string): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        name: `Excluir ${entity}?`,
        text: `O ${entity} será excluido de forma definitiva.`,
        cancelText: 'CANCELAR',
        okText: 'EXCLUIR'
      }
    });
    return dialogRef.afterClosed();
  }

  confirmRemovalFemaleArticle(entity: string): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        name: `Excluir ${entity}?`,
        text: `A ${entity} será excluida de forma definitiva.`,
        cancelText: 'CANCELAR',
        okText: 'EXCLUIR'
      }
    });
    return dialogRef.afterClosed();
  }
}
