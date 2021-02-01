import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTooltipDefaultOptions, MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/server/user.service';
import { User } from 'src/app/models/user.model';
import { filter, switchMap, take } from 'rxjs/operators';
import { initLogoAnimation, userNavAnimation } from 'src/app/utility/navbar-gsap-animations';

export const navbarTooltip: MatTooltipDefaultOptions = {
  showDelay: 150,
  hideDelay: 150,
  touchendHideDelay: 150,
};

@Component({
  selector: 'app-user-navbar',
  templateUrl: './user-navbar.component.html',
  styleUrls: ['./user-navbar.component.scss', '../../../styles/tooltips.scss'],
  providers: [
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: navbarTooltip },
  ],
  encapsulation: ViewEncapsulation.None,
})
export class UserNavbarComponent implements OnInit {

  @ViewChild('title', { static: true }) title: ElementRef;
  @ViewChild('menuItem1', { static: true }) menuItem1: ElementRef;
  @ViewChild('menuItem2', { static: true }) menuItem2: ElementRef;
  @ViewChild('menuItem3', { static: true }) menuItem3: ElementRef;
  @ViewChild('menuItem4', { static: true }) menuItem4: ElementRef;

  constructor(private userService: UserService, private router: Router) { }

  isLogged = false;
  currentUser: User;

  ngOnInit(): void {
    this.userService.loginStatus.pipe(
      filter(Boolean),
      switchMap(() => this.userService.getUser()),
      take(1)
    )
      .subscribe((user) => {
        this.currentUser = user;
        this.isLogged = true;
      });
    this.initialAnimations();
  }

  initialAnimations = () => {
    initLogoAnimation(this.title.nativeElement);
    const menuItems = [this.menuItem1, this.menuItem2, this.menuItem3, this.menuItem4].map(el => el.nativeElement);
    let delay = 0.3;
    menuItems.forEach((element) => {
      userNavAnimation(element, delay);
      delay += 0.3;
    });
  }

  logout = () => {
    localStorage.removeItem('token');
    this.isLogged = false;
    this.currentUser = null;
    this.userService.changeLoginSubject(false);
    this.router.navigate(['home']);
  }

}
