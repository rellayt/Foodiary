import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { first, map, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { SnackBarService } from '../services/snack-bar.service';
import { LoginCredentials, RegisterCredentials, Session } from '../models/credentials.model';



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
  registerExtended(data) {
    return this.http.post<Session>(`${environment.API_URL}/auth/register_extended`, data,
      { headers: { skip: "true" } }).pipe(
        tap(res => {
          this.cookieService.set('token', res.token)
          setTimeout(() => this.session.next(res), 230)
        })
      )
  }

  logout(message?: string, navigateTo = '/home') {
    this.cookieService.deleteAll()
    this.session.next({
      user: null,
      token: null,
      message
    })
    if (message) this.snackBar.open(message, 3500, true);
    setTimeout(() => this.router.navigate([navigateTo]), 100)

  }

  authenticate() {
    if (!this.cookieService.check('token')) return
    const token = this.cookieService.get('token')

    this.http.get<User>(`${environment.API_URL}/auth/authenticate`, { headers: new HttpHeaders({ 'x-auth-token': token }) })
      .pipe(first())
      .subscribe(res => this.session.next({ user: res, token }))
  }

  constructor(private http: HttpClient, private cookieService: CookieService, private router: Router, private snackBar: SnackBarService) {
    this.state.subscribe(state => this.isAuthenticated = !!state)
  }
}
