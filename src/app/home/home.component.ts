import { Component, OnInit, ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { gsap } from 'gsap';
import { UserService } from '../services/server/user.service';
import { Router } from '@angular/router';
import { OnceClickedService } from '../services/animation/once-clicked.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('welcomeWindow', { static: true }) welcomeRef: ElementRef<HTMLDivElement>;
  @ViewChild('arrow', { static: true }) arrowRef: ElementRef<HTMLDivElement>;
  @ViewChild('arrowContainer', { static: true }) arrowContainerRef: ElementRef<HTMLDivElement>;

  constructor(private userService: UserService, private router: Router, private onceClickedService: OnceClickedService) {
    this.userService.loginStatus.subscribe(loginStatus => {
      if (loginStatus) {
        this.router.navigate(['profile']);
      }
    });
  }

  ngOnInit(): void {
    this.onceClickedService.onceClickedSubject.subscribe(value => {
      if (value)
        this.checkedWelcomeAnimation();
      else
        this.startWelcomeAnimation();
    });
  }

  startWelcomeAnimation = () => {
    gsap.from(this.welcomeRef.nativeElement, {
      duration: 2.2,
      opacity: 0,
      y: -40,
      stagger: 10,
      delay: 2.2
    });
    gsap.from(this.arrowContainerRef.nativeElement, {
      duration: 2.2,
      opacity: 0,
      y: -40,
      stagger: 10,
      delay: 2.5
    });
    gsap.fromTo(this.arrowRef.nativeElement,
      { duration: 0.7, opacity: 1, delay: 0.2 },
      { duration: 0.7, opacity: 0, repeat: -1, yoyo: true }
    );
  }
  checkedWelcomeAnimation = () => {
    gsap.from(this.welcomeRef.nativeElement, {
      duration: 1.5,
      opacity: 0,
      y: -40,
      stagger: 10,
      delay: 0.2
    });
    gsap.from(this.arrowContainerRef.nativeElement, {
      duration: 1.5,
      opacity: 0,
      y: -40,
      stagger: 10,
      delay: 0.5
    });
    gsap.fromTo(this.arrowRef.nativeElement,
      { duration: 0.7, opacity: 1, delay: 0.2 },
      { duration: 0.7, opacity: 0, repeat: -1, yoyo: true }
    );
  }
}
