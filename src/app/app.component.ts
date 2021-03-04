import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { OnDestroy } from '@angular/core';

export let browserRefresh = false;
export let previousPage = '';
@Component({
  selector: 'app-main',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  title = 'Foodiary';
  routerEvent: Subscription;

  constructor(private auth: AuthService, private router: Router) {
    this.routerEvent = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) browserRefresh = !this.router.navigated;

      if (event instanceof NavigationEnd) {
        setTimeout(() => previousPage = event.url, 200);
      }
    });
  }

  get isAuthenticated() { return this.auth.isAuthenticated }

  ngOnDestroy() {
    this.routerEvent.unsubscribe();
  }
}
