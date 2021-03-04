import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { startAnimation } from 'src/app/utility/basic-animations';

@Component({
  selector: 'app-sub-navigation',
  templateUrl: './sub-navigation.component.html',
  styleUrls: ['./sub-navigation.component.scss']
})
export class SubNavigationComponent implements OnInit, OnDestroy {

  pages = [{ label: 'Profil', link: 'profile' },
  { label: 'Dziennik', link: 'diary' }, { label: 'Szablony', link: 'template' },
  { label: 'Produkty', link: 'products' }, { label: 'Dodaj przepis', link: 'add-recipe' }];

  activeLink;
  @ViewChild('subNavRef', { static: true }) subNavRef: ElementRef;
  @ViewChild('linkRef', { static: true }) linkRef: ElementRef;

  routerEvent: Subscription

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    startAnimation(this.subNavRef.nativeElement, 1.5,)
    startAnimation(this.linkRef.nativeElement, 3.5, 0, -15)

    this.routerEvent = this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.activeLink = event.url.split('/')[1]
      });
  }

  ngOnDestroy(): void {
    this.routerEvent.unsubscribe()
  }
}
