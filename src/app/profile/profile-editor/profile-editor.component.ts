import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { startAnimation } from 'src/app/utility/basic-animations';
import { Router, RoutesRecognized } from '@angular/router';
import { filter } from 'rxjs/operators';
import { browserRefresh, previousPage } from '../../app.component';
import { endAnimation } from '../../utility/basic-animations';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile-editor',
  templateUrl: './profile-editor.component.html',
  styleUrls: ['./profile-editor.component.scss']
})
export class ProfileEditorComponent implements OnInit, OnDestroy {
  @ViewChild('profileEditorRef', { static: true }) profileEditorRef: ElementRef;

  panelOpenState = false;

  step = 2
  routerEvent: Subscription
  constructor(private router: Router) { }

  ngOnInit(): void {
    const props = browserRefresh ? [1, 0] : previousPage === '/profile/settings' ? [0.35, 20] : [0.35, -20]

    startAnimation(this.profileEditorRef.nativeElement, props[0], props[1])

    this.routerEvent = this.router.events
      .pipe(filter(event => event instanceof RoutesRecognized))
      .subscribe((event: any) => {
        const nextPage = event.url

        const value = nextPage === '/profile/settings' ? 20 : nextPage === '/profile/about_me' ? -20 : 0

        endAnimation(this.profileEditorRef.nativeElement, 0.35, value)
      });
  }

  ngOnDestroy(): void {
    this.routerEvent.unsubscribe()
  }

}
