import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private user_request: Observable<User>

  getUserProfile() {
    if (!this.user_request) {
      this.user_request = this.auth.state.pipe(
        filter(() => this.auth.isAuthenticated),
        map(() => this.auth.getCurrentUser())
      )
    }

    return this.user_request
  }

  constructor(private auth: AuthService) { }
}
