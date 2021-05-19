import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { catchError, debounceTime, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EMPTY } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthorizedGuard implements CanActivate {
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    return this.auth.isAuthenticated ? true :
      this.auth.state.pipe(
        debounceTime(250),
        tap(state => !state ?
          this.auth.logout('Błąd uwierzytelniania - zaloguj się ponownie', 'login') : null
        )
      )
  }

  constructor(private auth: AuthService, private router: Router, private _snackBar: MatSnackBar) { }

}
