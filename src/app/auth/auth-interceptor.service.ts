import { HttpEvent, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return req.headers.get('skip') ? next.handle(req) :
      next.handle(this.getAuthorizedRequest(req)).pipe(
        catchError((err, caught) => {
          console.log('error');

          if (err instanceof HttpErrorResponse && err.status === 401) {
            console.log('wurt');

            this.auth.logout('Authorization Required - Please log in!')
            return EMPTY
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
