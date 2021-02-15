import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MacroService } from '../services/macro.service';
import { profileInitAnimation } from '../utility/profile-gsap-animations';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  @ViewChild('profileCardRef', { static: true }) profileCardRef: ElementRef;

  constructor(private router: Router, private macroService: MacroService) {
  }

  ngOnInit(): void {
    profileInitAnimation(this.profileCardRef.nativeElement, 0, 1.5, 0)
    /*     this.router.events.pipe(filter(event => event instanceof NavigationEnd))
          .subscribe((event: any) => {
            console.log(event);
            console.log(event.url.split('/')[2]);
          }); */
  }
  ngOnDestroy(): void {
    this.macroService.clearMacroCache()
  }

}
