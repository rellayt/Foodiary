import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { catchError, map, mapTo } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EMPTY } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthorizedGuard implements CanActivate {
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    return this.auth.isAuthenticated ? true :
      this.auth.authenticate().pipe(
        map(res => !!res),
        catchError(() => {
          this.handleError();
          return EMPTY
        })
      )
  }

  handleError() {
    this.router.navigate(['login'])
    this._snackBar.open('Błąd uwierzytelniania - zaloguj się ponownie', "X", {
      duration: 3500,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: 'mat-snack-bar-error'
    });
  }

  constructor(private auth: AuthService, private router: Router, private _snackBar: MatSnackBar) { }

}
