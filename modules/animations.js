import gsap from "gsap";
import { Power3 } from "gsap";

gsap.fromTo(
  ".fire-img-1",
  { y: 30 },
  {
    y: 0,
    ease: "none",
    yoyo: true,
    duration: 4,
    repeat: -1,
  }
);
gsap.to(".hero-main-img", {
  y: 20,
  ease: "none",
  yoyo: true,
  duration: 4,
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
