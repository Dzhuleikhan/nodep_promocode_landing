import gsap from "gsap";

gsap.fromTo(
  ".step-wrapper",
  {
    scale: 0.5,
    opacity: 0,
  },
  {
    scale: 1,
    opacity: 1,
    duration: 1.5,
    delay: 0.3,
    ease: "bounce",
  },
);

gsap.utils.toArray(".hero-image").forEach((img, i) => {
  gsap.to(img, {
    y: "-=30",
    duration: 2 + Math.random() * 2,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut",
    delay: i * 0.3,
  });
});

gsap.to(".hero-btn", {
  scale: 1.1,
  ease: "none",
  yoyo: true,
  repeat: -1,
  duration: 1,
});
