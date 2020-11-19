import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/server/user.service';
import { User } from '../../shared/models/user.model';
import { Router } from '@angular/router';
import { SubNavigationService } from 'src/app/services/sub-navigation/sub-navigation.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  currentUser: User;

  constructor(private userService: UserService, private router: Router, private subNavigationService: SubNavigationService) {
    this.subNavigationService.changeActiveLinkSubject('profile');

    this.userService.getUser().subscribe(
      user => {
        this.currentUser = user;
        this.currentUser.login = `${user.login[0].toUpperCase()}${user.login.slice(1, user.login.length)}`;
        this.userService.changeLoginSubject(true);
      },
      error => this.router.navigate(['/welcome'])
    );
  }

  ngOnInit(): void {

  }
}
