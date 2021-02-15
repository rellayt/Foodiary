import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { first, map, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { CookieService } from 'ngx-cookie-service';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface Session {
  token: string;
  user: User;
  message?: string;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private session = new BehaviorSubject<Session>(null)

  isAuthenticated = false

  state = this.session.pipe(
    map(session => session && !!session.token),
  )

  getToken() {
    const session = this.session.getValue()
    return session && session.token
  }

  getCurrentUser() {
    const session = this.session.getValue()
    return session && session.user
  }

  getMessage() {
    const session = this.session.getValue()
    return session && session.message
  }

  updateCurrentUser(user: User, token?: string) {
    token = !token ? this.cookieService.get('token') : token
    console.log(user);

    const session = { user: user, token: token }
    this.session.next(session)
  }

  login(credentials: LoginCredentials) {
    return this.http.post<Session>(`${environment.API_URL}/auth/login/`, credentials,
      { headers: { skip: "true" } }).pipe(
        tap(res => {
          this.cookieService.set('token', res.token)
          this.session.next(res)
        }))
  }

  register(registrationData: RegisterCredentials) {
    return this.http.post<Session>(`${environment.API_URL}/auth/register`, registrationData,
      { headers: { skip: "true" } }).pipe(
        tap(res => {
          this.cookieService.set('token', res.token)
          this.session.next(res)
        })
      )
  }

  logout(message?: string) {
    this.cookieService.delete('token', '/')

    if (message) {
      this._snackBar.open(message, "X", {
        duration: 3500,
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
        panelClass: 'mat-snack-bar-error'
      });
    }

    this.router.navigate(['home'])
    this.session.next({
      ...this.session.getValue(),
      token: null,
      message
    })
  }

  authenticate() {
    const token = this.cookieService.get('token')
    if (!token) return throwError('No token')
    return this.http.get<User>(`${environment.API_URL}/auth/authenticate`,
      { headers: new HttpHeaders({ 'x-auth-token': token }) })
      .pipe(
        first(),
        tap(res => this.session.next({ user: res, token: token }))
      )
  }

  constructor(private http: HttpClient, private cookieService: CookieService, private router: Router, private _snackBar: MatSnackBar) {
    this.state.subscribe(state => this.isAuthenticated = !!state)
  }
}
