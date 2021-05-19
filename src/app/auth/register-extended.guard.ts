import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { SnackBarService } from '../services/snack-bar.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterExtendedGuard implements CanActivate {
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    const { extras } = this.router.getCurrentNavigation()
    if (extras.hasOwnProperty('state') && extras.state.hasOwnProperty('questionnaireData')) {
      return true
    } else {
      this.router.navigate(['/home'])
      this.snackBarService.open('Brak dostępu do strony', 1200, true)
      return false
    }

  }
  constructor(private snackBarService: SnackBarService, private router: Router) { }
}
