import { Injectable } from '@angular/core';
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private readonly snackBar: MatSnackBar) { }

  success(message: string) {
    this.snackBar.open(message, 'Fechar', { duration: 5000 })
  }

  error(message: string) {
    this.snackBar.open(message, 'Fechar', { duration: 5000 })
  }
}
