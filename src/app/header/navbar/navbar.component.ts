import { AfterViewChecked, ElementRef, OnChanges, ViewEncapsulation } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { gsap } from 'gsap';
import { User } from 'src/app/mainApp/shared/models/user.model';
import { UserService } from '../../services/server/user.service';
import { Router } from '@angular/router';
import {
  MAT_TOOLTIP_DEFAULT_OPTIONS,
  MatTooltipDefaultOptions,
} from '@angular/material/tooltip';
import { filter, switchMap } from 'rxjs/operators';

export const navbarTooltip: MatTooltipDefaultOptions = {
  showDelay: 150,
  hideDelay: 150,
  touchendHideDelay: 150,
};

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss', './../../styles/tooltips.scss'],
  providers: [
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: navbarTooltip },
  ],
  encapsulation: ViewEncapsulation.None,
})
export class NavbarComponent implements OnInit {
  @ViewChild('title', { static: true }) title: ElementRef<HTMLDivElement>;
  @ViewChild('menuItem1', { static: true }) menuItem1: ElementRef<
    HTMLDivElement
  >;
  @ViewChild('menuItem2', { static: true }) menuItem2: ElementRef<
    HTMLDivElement
  >;
  @ViewChild('menuItem3', { static: true }) menuItem3: ElementRef<
    HTMLDivElement
  >;
  @ViewChild('menuItem4', { static: true }) menuItem4: ElementRef<
    HTMLDivElement
  >;

  constructor(
    private userService: UserService,
    private router: Router,
  ) { }

  isLogged = false;
  currentUser: User;

  ngOnInit(): void {
    this.userService.loginStatus
      .pipe(
        filter(Boolean),
        switchMap(() => this.userService.getUser())
      )
      .subscribe((user) => {
        this.currentUser = user;
        this.isLogged = true;
      });
    this.initialAnimations();
  }
  initialAnimations = () => {
    this.initLogoAnimation();
    const menuItems = [
      this.menuItem1,
      this.menuItem2,
      this.menuItem3,
      this.menuItem4,
    ];
    let value = 1;
    menuItems.forEach((elementRef) => {
      this.initItemAnimation(elementRef, value);
      value += 0.3;
    });
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
      delay: 0.5,
    });
  }
  logout = () => {
    localStorage.removeItem('token');
    this.isLogged = false;
    this.currentUser = null;
    this.userService.changeLoginSubject(false);
    this.router.navigate(['welcome']);
  }
}
