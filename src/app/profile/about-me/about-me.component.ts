import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from '../../services/server/user.service';

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
        this.currentUser.name = `${user.name[0].toUpperCase()}${user.name.slice(1, user.name.length)}`;
        this.userService.changeLoginSubject(true);
      },
      error => this.router.navigate(['/home'])
    );
  }


  ngOnInit(): void {

  }

}
