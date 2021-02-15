import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { map, delay, first } from 'rxjs/operators';
import { EMPTY, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor(private http: HttpClient, private auth: AuthService) { }

  validateNameAvailability(options = { avoidCurrentValue: false }): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {

      let match = false
      if (options.avoidCurrentValue) {
        const { name } = this.auth.getCurrentUser()
        match = name.toLowerCase() === '' + control.value.toLowerCase()
      }

      return match ? of(null) : this.checkName(control.value).pipe(
        first(),
        delay(100),
        map(res => {
          return res.available ? null : { taken_username: true }
        })
      )
    }
  }

  validateEmailAvailability(options = { avoidCurrentValue: false }): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {

      let match = false
      if (options.avoidCurrentValue) {
        const { email } = this.auth.getCurrentUser()
        match = email.toLowerCase() === '' + control.value.toLowerCase()
      }

      return match ? of(null) : this.checkEmail(control.value).pipe(
        first(),
        delay(100),
        map(res => {
          return res.available ? null : { taken_email: true }
        })
      )
    }
  }

  validatePassword(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {

      return this.checkPassword(control.value).pipe(
        first(),
        delay(100),
        map(res => {
          return res ? null : { invalid_password: true }
        })
      )
    }
  }


  checkName(name: string) {
    return this.http.get<{ available: boolean }>(`${environment.API_URL}/auth/check_name/${name}`, { headers: { skip: "true" } })
  }

  checkEmail(email: string) {
    return this.http.get<{ available: boolean }>(`${environment.API_URL}/auth/check_email/${email}`, { headers: { skip: "true" } })
  }
  checkPassword(password: string) {
    return this.http.post<boolean>(`${environment.API_URL}/auth/check_password`, { password: password })
  }
}
