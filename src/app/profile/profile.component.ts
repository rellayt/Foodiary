import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/server/user.service';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { SubNavigationService } from 'src/app/layout/sub-navigation/sub-navigation.service';

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
        this.currentUser.name = `${user.name[0].toUpperCase()}${user.name.slice(1, user.name.length)}`;
        this.userService.changeLoginSubject(true);
      },
      error => this.router.navigate(['/home'])
    );
  }

  ngOnInit(): void {

  }
}
