import { User } from '../../models/user.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { OnceClickedService } from '../animation/once-clicked.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  readonly baseUrlRegister = 'http://localhost:7777/register/';
  readonly baseUrlLogin = 'http://localhost:7777/login/';

  loginStatusSubject = new BehaviorSubject<boolean>(false);
  loginStatus = this.loginStatusSubject.asObservable();

  userSubject = new BehaviorSubject<User>(null);
  user = this.userSubject.asObservable();

  constructor(private http: HttpClient, public router: Router, private onceClickedService: OnceClickedService) {
    if (localStorage.getItem('token')) {
      this.getUser().subscribe(
        user => {
          this.changeUserSubject(user as User);
          this.changeLoginSubject(true);
          this.onceClickedService.changeOnceClickedSubject(true);
        });
    }
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    return throwError(error);
  }

  private extractData(res: Response) {
    const body = JSON.parse(JSON.stringify(res));
    return body || {};
  }

  postUser(user) {
    return this.http.post(this.baseUrlRegister, user);
  }

  checkLogin(login: string) {
    return this.http.get(`${this.baseUrlRegister}checkAvailableLogin/${login}`).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  checkEmail(email: string) {
    return this.http.get(`${this.baseUrlRegister}checkAvailableEmail/${email}`, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  login(user: User) {
    return this.http.post(this.baseUrlLogin, user, { observe: 'body' });
  }

  changeLoginSubject(value: boolean) {
    this.loginStatusSubject.next(value);
  }
  changeUserSubject(user: User) {
    this.userSubject.next(user);
  }

  getUser() {
    return this.http.get<User>(`${this.baseUrlLogin}user/`, {
      observe: 'body',
      params: new HttpParams().append('token', localStorage.getItem('token'))
    });
  }

}
