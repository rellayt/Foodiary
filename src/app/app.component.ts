import { Component, OnInit } from '@angular/core';
import { User } from './models/user.model';
import { AuthService } from './auth/auth.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { NavigationStart, Router } from '@angular/router';
import { OnDestroy } from '@angular/core';

export let browserRefresh = false;
export let previousPage = '';
@Component({
  selector: 'app-main',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Foodiary';
  subscription: Subscription;

  constructor(private auth: AuthService, private router: Router) {
    this.subscription = router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        browserRefresh = !router.navigated;
        if (event.url.split('/')[2] !== 'edit') {
          previousPage = event.url.split('/')[2]
        }
      }
    });
  }

  get isAuthenticated() { return this.auth.isAuthenticated }

  ngOnInit() { }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
