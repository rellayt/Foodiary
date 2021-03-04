import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RoutesRecognized } from '@angular/router';
import { filter, finalize, map } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';
import { endAnimation, startAnimation } from 'src/app/utility/basic-animations';
import { ProfileService } from '../profile.service';
import { browserRefresh } from 'src/app/app.component';
import { Subscription } from 'rxjs';
import { previousPage } from '../../app.component';

@Component({
  selector: 'app-about-me',
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.scss']
})
export class AboutMeComponent implements OnInit, OnDestroy {
  @ViewChild('aboutMeRef', { static: true }) aboutMeRef: ElementRef;

  profile$ = this.profileService.getUserProfile()

  macro$ = this.route.data.pipe(
    map(data => data.macro)
  )
  routerEvent: Subscription
  constructor(private profileService: ProfileService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    const value = previousPage === "/profile/edit" || previousPage === "/profile/settings" ? 20 : 0
    startAnimation(this.aboutMeRef.nativeElement, 0.35, value)

    this.routerEvent = this.router.events
      .pipe(filter(event => event instanceof RoutesRecognized))
      .subscribe((event: any) => {
        const nextPage = event.url
        const value = nextPage.split('/')[1] !== 'profile' ? 0 : 20
        endAnimation(this.aboutMeRef.nativeElement, 0.35, value)
      });

  }
  ngOnDestroy(): void {
    this.routerEvent.unsubscribe()
  }
}
