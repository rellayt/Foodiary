import { HttpEvent, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return req.headers.get('skip') || req.headers.get('x-auth-token') ? next.handle(req) :
      next.handle(this.getAuthorizedRequest(req)).pipe(
        catchError((err, caught) => {

          if (err instanceof HttpErrorResponse && err.status === 401) {
            this.auth.logout('Błąd uwierzytelniania - zaloguj się ponownie')
            return of(null)
          }

          return throwError(err)
        })
      )
  }

  getAuthorizedRequest(req: HttpRequest<any>) {
    return req.clone({
      setHeaders: {
        'x-auth-token': this.auth.getToken()
      }
    })
  }

  constructor(private auth: AuthService) { }

}
