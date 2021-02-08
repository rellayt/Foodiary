import { AfterContentInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as Parallax from 'parallax-js';
import { gsap } from 'gsap';
import { AuthService } from '../../auth/auth.service';

declare var VANTA: any;
declare var Parallax: any;

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.scss']
})

export class BackgroundComponent implements OnInit, AfterContentInit {
  @ViewChild('background', { static: true }) background: ElementRef<HTMLDivElement>;

  constructor(private auth: AuthService) { }

  get isAuthenticated() { return this.auth.isAuthenticated }

  ngOnInit(): void {
    this.initialAnimations();

    VANTA.FOG({
      el: '#background',
      minHeight: 200.00,
      minWidth: 200.00,
      highlightColor: 0x2092fa,
      midtoneColor: 0xfcfcfc,
      lowlightColor: 0xffffff,
      baseColor: 0xffffff,
      blurFactor: 0.63,
      speed: 1.30,
      zoom: 1.10
    });
  }

  ngAfterContentInit() {
    const scene = document.getElementById('scene');
    const parallaxInstance = new Parallax(scene, {
      relativeInput: true,
      hoverOnly: true
    });
  }

  initialAnimations = () => {
    gsap.from(this.background.nativeElement, {
      duration: 1.5,
      opacity: 0,
      stagger: 0.2,
      delay: 0.5,
    });
  }
}
