import gsap from "gsap";
import horizontalLoop from "./marquee";

gsap.to(".advantage-img", {
  scale: 1.1,
  repeat: -1,
  yoyo: true,
  duration: 1,
  ease: "power1.inOut",
});

horizontalLoop(".payments-list", {
  repeat: -1,
  paused: false,
  speed: 0.3,
});

gsap.to(".preloader", { opacity: 0, duration: 0.5, delay: 2 });
