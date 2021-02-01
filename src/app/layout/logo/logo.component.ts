import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { logoStrokeDash, logoStrokeOpacity } from 'src/app/utility/navbar-gsap-animations';
import { UserService } from '../../services/server/user.service';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss']
})

export class LogoComponent implements OnInit {
  @ViewChild('foodiary', { static: true }) foodiary: ElementRef<HTMLDivElement>;
  loginStatus

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    logoStrokeDash(this.foodiary.nativeElement)

    this.userService.loginStatus.subscribe(loginStatus => {
      this.loginStatus = loginStatus;
      logoStrokeOpacity(this.foodiary.nativeElement, loginStatus)
    });
  }
}
