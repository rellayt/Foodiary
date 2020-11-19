import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { gsap } from 'gsap';
import { UserService } from '../../../services/server/user.service';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss']
})

export class LogoComponent implements OnInit {
  @ViewChild('foodiary', { static: true }) foodiary: ElementRef<HTMLDivElement>;
  constructor(private userService: UserService) { }

  loginStatus;

  ngOnInit(): void {
    this.initialAnimations();

    this.userService.loginStatus.subscribe(loginStatus => {
      this.loginStatus = loginStatus;
      if (this.loginStatus) {
        gsap.to(this.foodiary.nativeElement, {
          duration: 1,
          delay: 3,
          strokeOpacity: 1
        });
      } else {
        gsap.to(this.foodiary.nativeElement, {
          duration: 1,
          delay: 3,
          strokeOpacity: 0.2
        });
      }
    });
  }
  initialAnimations = () => {
    gsap.from(this.foodiary.nativeElement, {
      duration: 3,
      delay: 1,
      strokeLinecap: 0,
      strokeDasharray: 5000,
      strokeDashoffset: 5000,
      fill: 'none',
    });
    gsap.to(this.foodiary.nativeElement, {
      duration: 1,
      opacity: 0.90,
      delay: 3,
      fill: 'black',
      strokeOpacity: 0.2
    });

  }
}
