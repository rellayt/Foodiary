import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
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
          this.auth.logout('Błąd uwierzytelniania - zaloguj się ponownie', 'login')
          return EMPTY
        })
      )
  }

  constructor(private auth: AuthService, private router: Router, private _snackBar: MatSnackBar) { }

}
