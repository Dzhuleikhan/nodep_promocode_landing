import gsap from "gsap";
import { Power3 } from "gsap";

gsap.to(".hero-img", {
  scale: 1.05,
  ease: "none",
  yoyo: true,
  duration: 1,
  repeat: -1,
});
gsap.to(".fire-img", {
  y: 20,
  ease: "none",
  yoyo: true,
  duration: 2,
  repeat: -1,
});
