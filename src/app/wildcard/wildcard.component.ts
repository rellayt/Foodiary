import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { SnackBarService } from '../services/snack-bar.service';

@Component({
  selector: 'app-wildcard',
  template: ``
})
export class WildcardComponent implements OnInit {

  constructor(private auth: AuthService, private router: Router, private snackBar: SnackBarService) { }

  ngOnInit(): void {
    this.snackBar.openWarning('Nie znaleziono strony', 1400)
    setTimeout(() => {
      const url = !!this.auth.isAuthenticated ? 'profile' : 'home'
      this.router.navigateByUrl(url)
    }, 100)
  }

}
