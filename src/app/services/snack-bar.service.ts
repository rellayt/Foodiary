import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  constructor(private _snackBar: MatSnackBar) { }

  open(message: string, duration = 1000, error = false) {
    this._snackBar.open(message, "X", {
      duration: duration,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: error ? 'mat-snack-bar-error' : ''
    })
  }

  openWarning(message: string, duration = 1000) {
    this._snackBar.open(message, "X", {
      duration: duration,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: 'mat-snack-bar-warning'
    })
  }

}
