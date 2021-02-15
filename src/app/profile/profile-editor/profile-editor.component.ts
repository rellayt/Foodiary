import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { profileInitAnimation } from 'src/app/utility/profile-gsap-animations';
import { Router, RoutesRecognized } from '@angular/router';
import { filter } from 'rxjs/operators';
import { browserRefresh, previousPage } from '../../app.component';
import { profileEndAnimation } from '../../utility/profile-gsap-animations';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile-editor',
  templateUrl: './profile-editor.component.html',
  styleUrls: ['./profile-editor.component.scss']
})
export class ProfileEditorComponent implements OnInit, OnDestroy {
  @ViewChild('profileEditorRef', { static: true }) profileEditorRef: ElementRef;

  panelOpenState = false;
  constructor(private router: Router) { }

  eventSubscription: Subscription

  ngOnInit(): void {
    if (browserRefresh) {
      profileInitAnimation(this.profileEditorRef.nativeElement, 0, 1)
    } else if (previousPage === 'settings') {
      profileInitAnimation(this.profileEditorRef.nativeElement, 20)
    } else {
      profileInitAnimation(this.profileEditorRef.nativeElement, -20)
    }

    this.eventSubscription = this.router.events
      .pipe(filter(event => event instanceof RoutesRecognized))
      .subscribe((events: any) => {
        const nextPage = events.url.split('/')[2]

        nextPage === 'settings' ? profileEndAnimation(this.profileEditorRef.nativeElement, 20) :
          profileEndAnimation(this.profileEditorRef.nativeElement, -20)

      });
  }

  ngOnDestroy(): void {
    this.eventSubscription.unsubscribe()
  }

}
