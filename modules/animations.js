import gsap from "gsap";
import { Power3 } from "gsap";

gsap.to(".animation-down", {
  y: 20,
  ease: "none",
  yoyo: true,
  duration: 3,
  repeat: -1,
});
gsap.to(".animation-up", {
  y: -20,
  ease: "none",
  yoyo: true,
  duration: 3,
  repeat: -1,
});
