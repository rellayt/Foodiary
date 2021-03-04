import { gsap } from 'gsap';

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
export const endAnimation = (item, duration = 0.35, x = 0, y = 0) => {
  gsap.to(item, {
    x: x,
    y: y,
    opacity: 0,
    duration: duration,
    delay: 0.0,
    stagger: 10,
  });
}
export const fromToOpacityAnimation = (item, duration = 0.35) => {
  gsap.fromTo(item, {
    opacity: 0,
    duration: duration,
    delay: 0.0,
    stagger: 10,
  }, {
    opacity: 1
  });
}
