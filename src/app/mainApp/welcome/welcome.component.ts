import { AfterContentInit, Component, OnInit, ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { gsap, Linear } from 'gsap';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit, AfterContentInit {
  @ViewChild('welcomeWindow', { static: true }) welcomeRef: ElementRef<HTMLDivElement>;
  @ViewChild('arrow', { static: true }) arrowRef: ElementRef<HTMLDivElement>;
  @ViewChild('arrowContainer', { static: true }) arrowContainerRef: ElementRef<HTMLDivElement>;

  constructor() { }

  ngOnInit(): void {
    this.initWelcomeWindowAnimation();
  }
  ngAfterContentInit() {

  }
  initWelcomeWindowAnimation = () => {
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
}
