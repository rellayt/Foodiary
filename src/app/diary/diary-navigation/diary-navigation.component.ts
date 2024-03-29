import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-diary-navigation',
  templateUrl: './diary-navigation.component.html',
  styleUrls: ['./diary-navigation.component.scss']
})
export class DiaryNavigationComponent implements OnInit {

  pages = [{ label: 'Lista', link: 'list' },
  { label: 'Dodaj dziennik', link: 'addition' }]

  activeLink
  routerEvent: Subscription;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.activeLink = this.router.url.split('/')[2]
    this.routerEvent = this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.activeLink = event.url.split('/')[2]
      });
  }
  ngOnDestroy() {
    this.routerEvent.unsubscribe();
  }
}
