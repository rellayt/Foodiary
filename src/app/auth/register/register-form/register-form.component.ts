import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { timer, Subscription } from 'rxjs';
import { first, switchMap, filter } from 'rxjs/operators';
import { ValidationService } from '../../../validation/validation.service';
import { validatePassword, validateUsername, validateEmail } from '../../../validation/validators';
import { AuthService } from '../../auth.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent implements OnInit, OnDestroy {

  @Input() registerExtended = false
  @Output() formValueEmitter = new EventEmitter()

  registrationForm: any
  profileUrl = 'profile'
  statusSubscription: Subscription

  hide = true
  loading = false

  constructor(private form: FormBuilder, private auth: AuthService,
    private router: Router, private validation: ValidationService,
    private matDialog: MatDialog) {

    this.registrationForm = this.form.group({
      name: this.form.control('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(12),
        validateUsername()
      ], this.validation.usernameAvailability()),
      email: this.form.control('', [
        Validators.required,
        validateEmail()
      ], this.validation.emailAvailability()),
      password: this.form.control('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30),
        validatePassword({
          uppercase: true,
          lowercase: true,
          number: true,
          special: false
        })
      ]),
      repeat_password: this.form.control('', [Validators.required]),
    }, { updateOn: 'blur' });
  }

  ngOnInit(): void {
    this.statusSubscription = this.registrationForm
      .statusChanges
      .pipe(filter(() => this.registerExtended))
      .subscribe(status =>
        status === 'VALID' ? this.formValueEmitter.emit(this.registrationForm.value) :
          status === 'INVALID' ? this.formValueEmitter.emit(null) : this.formValueEmitter.emit('PENDING')
      )
  }

  ngOnDestroy(): void {
    this.statusSubscription.unsubscribe()
  }

  save() {
    this.loading = true
    timer(500).pipe(
      switchMap(() => this.auth.register(this.registrationForm.value)),
      first()
    ).subscribe(() => {
      this.router.navigate([this.profileUrl])
      this.matDialog.closeAll()
    }, error => {
      this.loading = false;
      console.error(error)
    })
  }
}
