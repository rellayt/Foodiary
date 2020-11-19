import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/mainApp/shared/models/user.model';
import { UserService } from '../../../../services/server/user.service';

@Component({
  selector: 'app-about-me',
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.scss']
})
export class AboutMeComponent implements OnInit {

  currentUser: User;

  constructor(private userService: UserService, private router: Router) {
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
