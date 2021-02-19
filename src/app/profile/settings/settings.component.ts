import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { ValidationService } from 'src/app/validation/validation.service';
import { validateEmail, validatePassword, validateUsername } from 'src/app/validation/validators';
import { ProfileService } from '../profile.service';
import { Subscription, timer } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RoutesRecognized } from '@angular/router';
import { subpageEndAnimation, subpageInitAnimation } from 'src/app/utility/subpage-animations';
import { browserRefresh } from '../../app.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteProfileDialogComponent } from './delete/delete-profile-dialog.component';
import { UserService } from '../../user/user.service';
import { SnackBarService } from '../../services/snack-bar.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit, OnDestroy {
  @ViewChild('profileSettingsRef', { static: true }) profileSettingsRef: ElementRef;
  @ViewChild('dialogOpenButton', { static: true }) dialogOpenButton: any;

  hideActualPassword = true
  hideNewPassword = true
  loading = false

  settingsForm: any
  eventSubscription: Subscription
  dialogSubscription: Subscription

  profile$ = this.profileService.getUserProfile().pipe(
    map(profile => { return { name: profile.name, email: profile.email } })
  )


  ngOnInit(): void {
    this.profile$.pipe(take(1)).subscribe(profile => this.settingsForm.patchValue(profile))

    browserRefresh ? subpageInitAnimation(this.profileSettingsRef.nativeElement, 0, 1) :
      subpageInitAnimation(this.profileSettingsRef.nativeElement, -20)

    this.eventSubscription = this.router.events.pipe(filter(event => event instanceof RoutesRecognized))
      .subscribe((event: any) => {
        subpageEndAnimation(this.profileSettingsRef.nativeElement, -20)
      });
    this.dialogSubscription = this.matDialogRef.afterAllClosed.subscribe(() => {
      this.dialogOpenButton._elementRef.nativeElement.classList.remove('cdk-program-focused');
      this.dialogOpenButton._elementRef.nativeElement.classList.remove('cdk-focused');
    })
  }

  ngOnDestroy(): void {
    this.eventSubscription.unsubscribe()
    this.dialogSubscription.unsubscribe()
  }

  constructor(private form: FormBuilder, private validation: ValidationService,
    private profileService: ProfileService, private userService: UserService,
    private snackBar: SnackBarService, private router: Router, private matDialogRef: MatDialog) {

    this.settingsForm = this.form.group({
      name: this.form.control('', [
        Validators.minLength(3),
        Validators.maxLength(12),
        validateUsername()
      ],
        this.validation.validateNameAvailability({ avoidCurrentValue: true })
      ),
      email: this.form.control('', validateEmail(),
        this.validation.validateEmailAvailability({ avoidCurrentValue: true })
      ),
      password: this.form.control(null, Validators.required),
      newPassword: this.form.control(null, [
        Validators.minLength(6),
        Validators.maxLength(30),
        validatePassword({
          uppercase: true, lowercase: true, number: true, special: false
        })
      ]),
    }, { updateOn: 'blur' })
  }

  updateUserData() {
    const formValue = Object.assign({}, this.settingsForm.value)

    Object.keys(formValue).forEach((k) => (formValue[k] === null) && delete formValue[k])

    this.loading = true
    timer(500).pipe(
      switchMap(() => this.userService.update(formValue)),
    ).subscribe(data => {
      this.settingsForm.controls['password'].reset()
      this.settingsForm.controls['password'].setErrors(null)
      this.settingsForm.controls['newPassword'].reset()
      this.snackBar.open("Pomyślnie zapisano");
      this.loading = false
    }, error => {
      this.settingsForm.controls['password'].setErrors({ invalid_password: true })
      this.loading = false
    })
  }

  openDialog() {
    this.matDialogRef.open(DeleteProfileDialogComponent, {
      disableClose: true
    });
  }
}
