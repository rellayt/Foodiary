import { AfterContentInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as Parallax from 'parallax-js';
import { gsap } from 'gsap';

declare var VANTA: any;
declare var Parallax: any;

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.scss']
})

export class BackgroundComponent implements OnInit, AfterContentInit {
  @ViewChild('background', { static: true }) background: ElementRef<HTMLDivElement>;

  constructor() { }

  ngOnInit(): void {
    this.initialAnimations();

    VANTA.FOG({
      el: '#background',
      highlightColor: 0xffffff,
      midtoneColor: 0x489eeb,
      lowlightColor: 0xffffff,
      baseColor: 0xffffff,
      blurFactor: 0.67,
      speed: 1.70
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
