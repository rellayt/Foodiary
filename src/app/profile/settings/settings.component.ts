import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { map, take } from 'rxjs/operators';
import { ValidationService } from 'src/app/validation/validation.service';
import { validateEmail, validatePassword, validateUsername } from 'src/app/validation/validators';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  hideActualPassword = true
  hideNewPassword = true

  settingsForm: any
  profile$ = this.profileService.getUserProfile().pipe(
    take(1),
    map(profile => {
      return { name: profile.name, email: profile.email }
    })
  )

  actualProfile = { name: '', email: '' }

  ngOnInit(): void {
    this.profile$.subscribe(profile => {
      this.actualProfile.name = profile.name
      this.actualProfile.email = profile.email
      this.settingsForm.controls['name'].setValue(profile.name)
      this.settingsForm.controls['email'].setValue(profile.email)
    })
  }

  constructor(private form: FormBuilder, private validation: ValidationService,
    private profileService: ProfileService) {

    this.settingsForm = this.form.group({
      name: this.form.control('', [
        Validators.minLength(3),
        Validators.maxLength(12),
        validateUsername()
      ], this.validation.validateNameAvailability({ avoidCurrentValue: true })),
      email: this.form.control('', validateEmail(),
        this.validation.validateEmailAvailability({ avoidCurrentValue: true })),
      password: this.form.control('', Validators.required, this.validation.validatePassword()),
      newPassword: this.form.control('', [
        Validators.minLength(6),
        Validators.maxLength(30),
        validatePassword({
          uppercase: true,
          lowercase: true,
          number: true,
          special: false
        })]),
    }, { updateOn: 'submit' })
  }
}
