import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/server/user.service';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-diary',
  templateUrl: './diary.component.html',
  styleUrls: ['./diary.component.scss']
})
export class DiaryComponent implements OnInit {

  currentUser: User;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.userService.getUser().subscribe(
      user => {
        this.currentUser = user as User;
        this.userService.changeLoginSubject(true);
      },
      error => this.router.navigate(['/welcome'])
    );
  }

}
