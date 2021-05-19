import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { debounce, debounceTime, delay, map, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UnauthorizedGuard implements CanActivate {
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.auth.isAuthenticated ? false :
      this.auth.state.pipe(
        debounceTime(250),
        map(state => !state),
        tap(state => !state ? this.router.navigate(['profile']) : null),
      )
  }
  constructor(private auth: AuthService, private router: Router) { }

}
