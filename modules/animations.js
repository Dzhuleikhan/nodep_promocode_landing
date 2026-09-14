import gsap from "gsap";

// Декор hero плавно качается вверх-вниз на 10px. Длительности разные,
// чтобы три картинки не двигались синхронно.
[
  { target: ".hero-star", duration: 2.5 },
  { target: ".hero-seven", duration: 3 },
  { target: ".hero-orange", duration: 2 },
].forEach(({ target, duration }) => {
  gsap.to(target, {
    y: -10,
    ease: "sine.inOut",
    yoyo: true,
    duration,
    repeat: -1,
  });
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
