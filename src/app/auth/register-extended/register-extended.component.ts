import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { Macro } from '../../models/macro.model';
import { RegisterCredentials } from '../../models/credentials.model';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { startAnimation, endAnimation } from '../../utility/basic-animations';
import { SnackBarService } from '../../services/snack-bar.service';

@Component({
  selector: 'app-register-extended',
  templateUrl: './register-extended.component.html',
  styleUrls: ['./register-extended.component.scss']
})
export class RegisterExtendedComponent implements OnInit {
  @ViewChild('registerExtended', { static: true }) registerExtended: ElementRef;

  macroValue: Macro
  registerFormValue: RegisterCredentials
  profileUrl = 'profile'
  loading = false;
  routeState = []

  constructor(private authService: AuthService, private router: Router, private snackBar: SnackBarService) { }

  ngOnInit(): void {
    startAnimation(this.registerExtended.nativeElement, 0.5, 0, -5)
    startAnimation(this.registerExtended.nativeElement.childNodes[0], 0.5, 0, -5)
    let delay = 0.2
    this.registerExtended.nativeElement.childNodes[1].childNodes.forEach(node => {
      startAnimation(node, 0.6, 0, -10, delay)
      delay += 0.1
    })

    this.routeState = { ...window.history.state['questionnaireData'] }
  }

  setMacroValue = (value) => this.macroValue = value

  setRegisterFormValue(value) {
    this.loading = false
    if (value) {
      const { repeat_password, ...formValue } = value
      this.registerFormValue = formValue
    } else this.registerFormValue = value

    if (value === 'PENDING' && this.macroValue) this.loading = true
  }

  register() {
    setTimeout(() => this.router.navigate(['home']), 150)
    const data = { user: { ...this.registerFormValue }, macro: { ...this.macroValue } }

    this.authService.registerExtended(data).pipe(
      tap(() => this.loading = true),
    ).subscribe(() => {
      endAnimation(this.registerExtended.nativeElement, 0.5, 0, -5)
      endAnimation(this.registerExtended.nativeElement.childNodes[0], 0.5, 0, -5)
      let delay = 0.2
      this.registerExtended.nativeElement.childNodes[1].childNodes.forEach(node => {
        endAnimation(node, 0.4, 0, -10, 1, delay)
        delay += 0.1
      })
      this.router.navigate(['profile'])
      this.snackBar.open('Pomyślnie zarejestrowano', 1600)
    }, error => {
      this.loading = false;
      console.error(error)
    })
  }

}
