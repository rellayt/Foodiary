import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { profileInitAnimation } from 'src/app/utility/profile-gsap-animations';

@Component({
  selector: 'app-sub-navigation',
  templateUrl: './sub-navigation.component.html',
  styleUrls: ['./sub-navigation.component.scss']
})
export class SubNavigationComponent implements OnInit {

  pages = [{ label: 'Profil', link: 'profile' },
  { label: 'Dziennik', link: 'diary' }, { label: 'Szablony', link: 'template' },
  { label: 'Produkty', link: 'products' }, { label: 'Dodaj przepis', link: 'add-recipe' }];

  activeLink;
  @ViewChild('subNavRef', { static: true }) subNavRef: ElementRef;

  constructor(private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    profileInitAnimation(this.subNavRef.nativeElement, 0, 0.4, -5)

    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.activeLink = event.url.split('/')[1]
      });
  }
}
