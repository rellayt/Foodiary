import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { first, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Session } from '../models/credentials.model';


interface UpdateCredentials {
  name?: string,
  email?: string,
  password: string
  newPassword?: string,
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  getUser() {
    return this.http.get<Session>(`${environment.API_URL}/user`)
      .pipe(
        first(),
        tap(res => this.auth.updateCurrentUser(res.user, res.token))
      )
  }

  update(credentials: UpdateCredentials) {
    return this.http.put<User>(`${environment.API_URL}/user/`, credentials)
      .pipe(
        first(),
        tap(res => this.auth.updateCurrentUser(res))
      )
  }

  delete(password: string) {
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: { password: password },
    };
    return this.http.delete<{ message: string }>(`${environment.API_URL}/user`, options)
      .pipe(
        first(),
        tap(res => this.auth.logout(res.message))
      )
  }



  constructor(private http: HttpClient, private auth: AuthService) { }
}
