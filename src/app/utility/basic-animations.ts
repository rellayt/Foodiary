import { Xmb } from '@angular/compiler';
import { gsap } from 'gsap';
import { timer } from 'rxjs';
import { scan, startWith, takeWhile } from 'rxjs/operators';

export const startAnimation = (item, duration = 0.35, x = 0, y = 0) => {
  gsap.from(item, {
    x: x,
    y: y,
    opacity: 0,
    duration: duration,
    delay: 0.0,
    stagger: 10,
  });
}

export const endAnimation = (item, duration = 0.35, x = 0, y = 0, scaleY = 1) => {
  gsap.to(item, {
    x,
    y,
    opacity: 0,
    duration,
    scaleY,
    delay: 0.0,
    stagger: 20,
  });
}

export const fromToOpacityAnimation = (item, duration = 0.35, x = 0, y = 0) => {
  gsap.fromTo(item, {
    opacity: 0,
    duration,
    x,
    y,
    delay: 0.0,
    stagger: 10,
  }, {
    x: 0,
    y: 0,
    opacity: 1
  });
}

export const counterAnimation = (from: number, to: number) => {
  const absolute = Math.abs(from - to)
  const value = Math.round(((absolute / 10) * 5) / 7) || 0.3

  return timer(100, 35).pipe(
    startWith(from),
    scan(acc => from < to ? acc + value : acc - value),
    takeWhile(x => (from < to) ? (x <= to) : (x >= to)),
  )
}
