import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RoutesRecognized } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';
import { subpageEndAnimation, subpageInitAnimation } from 'src/app/utility/subpage-animations';
import { ProfileService } from '../profile.service';
import { browserRefresh } from 'src/app/app.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-about-me',
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.scss']
})
export class AboutMeComponent implements OnInit, OnDestroy {

  @ViewChild('aboutMeRef', { static: true }) aboutMeRef: ElementRef;

  profile$ = this.profileService.getUserProfile()
  eventSubscription: Subscription

  macro$ = this.route.data.pipe(
    map(data => data.macro)
  )

  constructor(private profileService: ProfileService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    browserRefresh ? subpageInitAnimation(this.aboutMeRef.nativeElement, 0, 1) :
      subpageInitAnimation(this.aboutMeRef.nativeElement, 20)

    this.eventSubscription = this.router.events.pipe(filter(event => event instanceof RoutesRecognized))
      .subscribe((event: any) => {
        subpageEndAnimation(this.aboutMeRef.nativeElement, 20)
      });

  }
  ngOnDestroy(): void {
    this.eventSubscription.unsubscribe()
  }
}
