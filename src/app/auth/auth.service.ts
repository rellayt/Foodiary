import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { first, map, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { CookieService } from 'ngx-cookie-service';
import { throwError } from 'rxjs';

interface Credentials {
  username: string;
  password: string;
}

interface Session {
  token: string;
  user: User;
  message?: string;
}

interface RegistrationData {
  name: string;
  email: string;
  password: string;
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

  logout(message?: string) {
    this.cookieService.delete('token')
    this.session.next({
      ...this.session.getValue(),
      token: null,
      message
    })
  }

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

  login(credentials: Credentials) {
    return this.http.post<Session>(`${environment.API_URL}/auth/login/`, credentials,
      { headers: { skip: "true" } }).pipe(
        tap(res => {
          if (res.user && res.token) {
            this.cookieService.set('token', res.token)
            this.session.next(res)
          }
        }))
  }

  register(registrationData: RegistrationData) {
    return this.http.post<Session>(`${environment.API_URL}/auth/register`, registrationData,
      { headers: { skip: "true" } }).pipe(
        tap(res => {
          if (res.user && res.token) {
            this.cookieService.set('token', res.token)
            this.session.next(res)
          }
        })
      )
  }

  getUser(token) {
    return this.http.get<User>(`${environment.API_URL}/auth/whoami/`, {
      headers: new HttpHeaders({ 'x-auth-token': token })
    })
      .pipe(first())
      .subscribe(res => {
        const session = { user: res, token: token }
        this.session.next(session)
      }, error => {
        if (error instanceof HttpErrorResponse) {
          console.error(error.error)
        }
      })
  }

  authenticate() {
    const token = this.cookieService.get('token')
    if (!token) return throwError('No token')
    return this.http.get<boolean>(`${environment.API_URL}/auth/authenticate`, {
      headers: new HttpHeaders({ 'x-auth-token': token })
    }).pipe(first())
  }

  constructor(private http: HttpClient, private cookieService: CookieService) {
    this.state.subscribe(state => this.isAuthenticated = !!state)
  }
}
