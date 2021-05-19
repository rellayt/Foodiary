import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { OnDestroy } from '@angular/core';
import { endAnimation, fromToOpacityAnimation, startAnimation } from './utility/basic-animations';
import { CookieService } from 'ngx-cookie-service';
import { SnackBarService } from './services/snack-bar.service';

export let browserRefresh = false
export let previousPage = ''
@Component({
  selector: 'app-main',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  @ViewChild('main', { static: true }) main: ElementRef;
  @ViewChild('subNavigation', { static: true }) subNavigation: ElementRef;
  title = 'Foodiary';
  routerEvent: Subscription;

  constructor(private auth: AuthService, private router: Router, private snackBar: SnackBarService) {
    this.routerEvent = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) browserRefresh = !this.router.navigated;

      if (event instanceof NavigationEnd) setTimeout(() => previousPage = event.url, 200);
    });


  }

  get isAuthenticated() { return this.auth.isAuthenticated }

  ngOnDestroy() {
    this.routerEvent.unsubscribe();
  }

  navigate(url) {
    endAnimation(this.main.nativeElement, 0.25)
    setTimeout(() => this.router.navigate([url]), 220)
    setTimeout(() => this.main.nativeElement.style.removeProperty('opacity'), 700)
  }


  logout() {
    endAnimation(this.main.nativeElement, 0.3)
    endAnimation(this.subNavigation.nativeElement, 0.35, 0, -20)
    this.snackBar.open("Wylogowano", 1200);
    setTimeout(() => {
      this.auth.logout()
      fromToOpacityAnimation(this.main.nativeElement, 0.3, 0, 0, 0.5)

      setTimeout(() => {
        this.subNavigation.nativeElement.style.removeProperty('opacity')
        this.subNavigation.nativeElement.style.removeProperty('transform')
      }, 50)
    }, 410)
  }

}
