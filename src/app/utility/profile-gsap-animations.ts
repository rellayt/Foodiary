import { gsap } from 'gsap';

export const profileInitAnimation = (item, x = 0, duration = 0.35, y = 0) => {
  gsap.from(item, {
    x: x,
    y: y,
    opacity: 0,
    duration: duration,
    delay: 0.0,
    stagger: 10,
  });
}
export const profileEndAnimation = (item, x = 0, duration = 0.35, y = 0) => {
  gsap.to(item, {
    x: x,
    y: y,
    opacity: 0,
    duration: duration,
    delay: 0.0,
    stagger: 10,
  });
}
