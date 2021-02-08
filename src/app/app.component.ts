import { Component, OnInit } from '@angular/core';
import { User } from './models/user.model';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Foodiary';
  constructor(private auth: AuthService) {
  }

  get isAuthenticated() { return this.auth.isAuthenticated }

  ngOnInit() { }
}
