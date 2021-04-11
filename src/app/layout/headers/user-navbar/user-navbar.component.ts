import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTooltipDefaultOptions, MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';
import { initLogoAnimation, userNavAnimation } from 'src/app/utility/navbar-gsap-animations';
import { startAnimation } from 'src/app/utility/basic-animations';
import { AuthService } from '../../../auth/auth.service';
import { ProfileService } from '../../../profile/profile.service';
import { SnackBarService } from '../../../services/snack-bar.service';

export const navbarTooltip: MatTooltipDefaultOptions = {
  showDelay: 150,
  hideDelay: 150,
  touchendHideDelay: 150,
};

@Component({
  selector: 'app-user-navbar',
  templateUrl: './user-navbar.component.html',
  styleUrls: ['./user-navbar.component.scss'],
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
  @ViewChild('userNavbar', { static: true }) userNavbar: ElementRef;

  profile = this.profileService.getUserProfile()

  ngOnInit(): void {
    this.initialAnimations()
    startAnimation(this.userNavbar.nativeElement, 0.5, 0, Math.random() < 0.5 ? -10 : 10)

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

  logout() {
    this.auth.logout();
    this.snackBar.open("Wylogowano", 1500);
  }

  constructor(private auth: AuthService, private snackBar: SnackBarService, private profileService: ProfileService) { }
}
