import { gsap } from 'gsap';
import { timer } from 'rxjs';
import { scan, startWith, takeWhile } from 'rxjs/operators';

export const startAnimation = (item, duration = 0.35, x = 0, y = 0, delay = 0) => {
  gsap.from(item, {
    x, y, duration, delay,
    opacity: 0,
    stagger: 20,
  });
}

export const endAnimation = (item, duration = 0.35, x = 0, y = 0, scaleY = 1, delay = 0) => {
  gsap.to(item, {
    x,
    y,
    opacity: 0,
    duration,
    scaleY,
    delay,
    stagger: 20,
  });
}
export const progressAnimation = (item, duration = 0.35, delay = 0, width = '0%') => {
  gsap.to(item, {
    duration,
    width,
    delay,
    stagger: 20,
  });
}

export const fromToOpacityAnimation = (item, duration = 0.35, x = 0, y = 0, delay = 0) => {
  gsap.fromTo(item, {
    opacity: 0,
    duration,
    x,
    y,
    stagger: 10,
  }, {
    delay,
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
