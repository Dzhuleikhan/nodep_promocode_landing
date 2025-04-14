import gsap from "gsap";
import horizontalLoop from "./marquee";
import { Power1 } from "gsap";

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

gsap.to(".preloader", { opacity: 0, duration: 0.25, delay: 0.5 });

horizontalLoop(".yellow-line-1", {
  repeat: -1,
  paused: false,
  speed: 0.3,
});

gsap.set(".marquee-1", {
  left: "-40px",
  bottom: "250px",
  rotate: 12,
  transformOrigin: "center center",
});
gsap.set(".marquee-2", {
  left: "-80px",
  bottom: "230px",
  rotate: -18,
  transformOrigin: "center center",
});
gsap.set(".wallet-image", {
  left: "50%",
  top: "50%",
  xPercent: -50,
  yPercent: -50,
});

const modalTimeLine = gsap.timeline();

modalTimeLine
  .to(
    ".marquee-1",
    {
      rotate: 5,
      ease: "none",
      duration: 2,
      yoyo: true,
      repeat: -1,
    },
    "<"
  )
  .to(
    ".marquee-2",
    {
      rotate: -12,
      ease: "none",
      duration: 2,
      yoyo: true,
      repeat: -1,
    },
    "<"
  )
  .fromTo(
    ".lion-image",
    {
      y: -30,
    },
    {
      y: 10,
      ease: Power1.easeInOut,
      duration: 2,
      yoyo: true,
      repeat: -1,
    },
    "<"
  )
  .to(
    ".wallet-image",
    {
      y: -20,
      rotate: -15,
      ease: "none",
      yoyo: true,
      repeat: -1,
      duration: 2,
    },
    "<"
  );
