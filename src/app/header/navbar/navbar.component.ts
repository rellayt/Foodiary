import { ElementRef } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { gsap } from 'gsap';
import { User } from 'src/app/mainApp/shared/models/user.model';
import { UserService } from '../../services/server/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @ViewChild('title', { static: true }) title: ElementRef<HTMLDivElement>;
  @ViewChild('menuItem1', { static: true }) menuItem1: ElementRef<HTMLDivElement>;
  @ViewChild('menuItem2', { static: true }) menuItem2: ElementRef<HTMLDivElement>;
  @ViewChild('menuItem3', { static: true }) menuItem3: ElementRef<HTMLDivElement>;
  @ViewChild('menuItem4', { static: true }) menuItem4: ElementRef<HTMLDivElement>;

  constructor(public userService: UserService, private router: Router) { }

  isLogged = false;
  currentUser: User;

  ngOnInit(): void {
    this.userService.loginStatus.subscribe(loginStatus => {
      this.isLogged = loginStatus;
    });
    this.userService.getUser().subscribe(user => this.currentUser = user);
    this.initialAnimations();
  }

  initialAnimations = () => {
    this.initLogoAnimation();
    this.initItemAnimation(this.menuItem1, 1);
    this.initItemAnimation(this.menuItem2, 1.3);
    this.initItemAnimation(this.menuItem3, 1.6);
    this.initItemAnimation(this.menuItem4, 1.9);
  }
  initItemAnimation = (item: ElementRef<HTMLDivElement>, delayValue: any) => {
    gsap.from(item.nativeElement, {
      duration: 1,
      opacity: 0,
      y: -25,
      stagger: 10,
      delay: delayValue,
    });
  }
  initLogoAnimation = () => {
    gsap.from(this.title.nativeElement, {
      duration: 1,
      opacity: 0,
      stagger: 0.2,
      delay: 0.5
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.userService.changeLoginSubject(false);
    this.router.navigate(['welcome']);
  }
}
