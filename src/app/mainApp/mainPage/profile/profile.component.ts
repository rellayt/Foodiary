import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/server/user.service';
import { User } from '../../shared/models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  currentUser: User;

  constructor(private userService: UserService, private router: Router) {
    this.userService.getUser().subscribe(
      user => {
        this.currentUser = user as User;
        this.userService.changeLoginSubject(true);
      },
      error => this.router.navigate(['/welcome'])
    );
  }

  ngOnInit(): void {

  }
}
