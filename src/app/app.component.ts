import { Component, OnInit } from '@angular/core';
import { UserService } from './services/server/user.service';
import { User } from './mainApp/shared/models/user.model';
@Component({
  selector: 'app-main',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [UserService]
})
export class AppComponent implements OnInit {
  isLogged = false;
  title = 'Foodiary';
  constructor(private userService: UserService) {
    this.userService.loginStatus.subscribe(loginStatus => this.isLogged = loginStatus);
  }

  ngOnInit() {

  }
}
