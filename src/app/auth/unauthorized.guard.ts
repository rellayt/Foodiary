import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { debounceTime, map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UnauthorizedGuard implements CanActivate {
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.auth.state.pipe(
      debounceTime(100),
      map(state => {
        if (!state) return true

        this.router.navigate(['profile'])
        return false
      }
      )
    )
  }
  constructor(private auth: AuthService, private router: Router) { }

}
