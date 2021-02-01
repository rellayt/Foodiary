import { gsap } from 'gsap';

export const initLogoAnimation = (element) => {
  gsap.from(element, {
    duration: 1,
    opacity: 0,
    stagger: 0.2,
    delay: 1,
  });
}

export const userNavAnimation = (item, delayValue) => {
  gsap.from(item, {
    y: -20,
    opacity: 0,
    duration: 0.7,
    delay: delayValue,
  });
}

export const guestNavAnimation = (item, delayValue) => {
  gsap.fromTo(item, { y: -20 }, {
    y: 0,
    duration: 0.7,
    opacity: 1,
    stagger: 10,
    delay: delayValue,
  });
}

export const logoStrokeDash = (element) => {
  gsap.from(element, {
    duration: 3,
    delay: 1,
    strokeLinecap: 0,
    strokeDasharray: 5000,
    strokeDashoffset: 5000,
    fill: 'none',
  })
  gsap.to(element, {
    duration: 1,
    opacity: 0.90,
    delay: 3,
    fill: 'black',
    strokeOpacity: 0.2
  })
}

export const logoStrokeOpacity = (element, loginStatus) => {
  const opacity = loginStatus ? 1 : 0.7

  gsap.to(element, {
    duration: 1,
    delay: 3,
    strokeOpacity: opacity
  });
}
