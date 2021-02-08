import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizedGuard implements CanActivate {
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    return this.auth.isAuthenticated ? true :
      this.auth.authenticate().pipe(
        catchError(err => this.router.navigate(['login']))
      )
  }
  constructor(private auth: AuthService, private router: Router) { }

}
