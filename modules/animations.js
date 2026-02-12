import gsap from "gsap";
import { Power3 } from "gsap";

gsap.to(".left-wave", {
  x: -20,
  duration: 4,
  ease: "linear",
  repeat: -1,
  yoyo: true,
});
gsap.to(".right-wave", {
  x: 20,
  duration: 4,
  ease: "linear",
  repeat: -1,
  yoyo: true,
});
gsap.to(".blue-fish", {
  y: 30,
  rotate: -15,
  duration: 5,
  ease: "linear",
  repeat: -1,
  yoyo: true,
});
