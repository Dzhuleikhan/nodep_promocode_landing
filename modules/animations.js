import gsap from "gsap";
import { Power3 } from "gsap";

gsap.to(".hero-img", {
  scale: 1.05,
  ease: "none",
  yoyo: true,
  duration: 1,
  repeat: -1,
});
gsap.to(".heart", {
  scale: 0.9,
  ease: "none",
  yoyo: true,
  duration: 1,
  repeat: -1,
});
gsap.to(".cloud-left", {
  x: -25,
  ease: "none",
  yoyo: true,
  duration: 2,
  repeat: -1,
});
gsap.to(".cloud-right", {
  x: 25,
  ease: "none",
  yoyo: true,
  duration: 2,
  repeat: -1,
});
gsap.to(".lollipop", {
  y: -20,
  ease: "none",
  yoyo: true,
  duration: 2,
  repeat: -1,
});
gsap.to(".bomb", {
  y: 20,
  ease: "none",
  yoyo: true,
  duration: 2,
  repeat: -1,
});
gsap.to(".star-img", {
  scale: 1.05,
  ease: "none",
  yoyo: true,
  duration: 2,
  repeat: -1,
});
gsap.to(".seven-img", {
  scale: 1.05,
  ease: "none",
  yoyo: true,
  duration: 2,
  repeat: -1,
});
gsap.to(".orange-img", {
  y: 40,
  ease: "none",
  yoyo: true,
  duration: 3,
  repeat: -1,
});

gsap
  .matchMedia()
  .add(
    { isDesktop: "(min-width: 993px)", isMobile: "(max-width: 992px)" },
    (context) => {
      gsap.to(".wager-badge", {
        scale: 1.05,
        rotation: context.conditions.isDesktop ? 5 : 0,
        force3D: true,
        ease: "none",
        yoyo: true,
        duration: 2,
        repeat: -1,
      });
    },
  );
