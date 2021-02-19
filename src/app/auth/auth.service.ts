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
import { SnackBarService } from '../services/snack-bar.service';

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

  logout(message?: string, navigateTo = 'home') {
    this.cookieService.delete('token', '/')
    this.session.next({
      user: null,
      token: null,
      message
    })

    if (message) this.snackBar.open(message, 3500, true);

    this.router.navigate([navigateTo])
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

  constructor(private http: HttpClient, private cookieService: CookieService, private router: Router, private snackBar: SnackBarService) {
    this.state.subscribe(state => this.isAuthenticated = !!state)
  }
}
