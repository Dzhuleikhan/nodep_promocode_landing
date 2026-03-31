import gsap from "gsap";

gsap.to(".preloader", { opacity: 0, duration: 0.25, delay: 0.5 });

// Boxes rocking
gsap.to(".boxes-img", {
  x: 30,
  duration: 2,
  ease: "sine.inOut",
  repeat: -1,
  yoyo: true,
  transformOrigin: "center bottom",
});

// Yellow balls — random floating & scaling
document.querySelectorAll(".yellow-ball").forEach((ball) => {
  const dur = 2 + Math.random() * 3;
  const delay = Math.random() * 2;

  gsap.to(ball, {
    x: () => -30 + Math.random() * 60,
    y: () => -30 + Math.random() * 60,
    scale: 0.65 + Math.random() * 0.7,
    duration: dur,
    ease: "cubic-bezier(" + Math.random().toFixed(2) + "," + Math.random().toFixed(2) + "," + Math.random().toFixed(2) + "," + Math.random().toFixed(2) + ")",
    repeat: -1,
    yoyo: true,
    delay,
  });
});

// Comets zigzag
const comets = document.querySelectorAll(".comet");
const hero = document.querySelector("#hero");
if (comets.length && hero) {
  function getZone(ci) {
    const w = hero.offsetWidth;
    const mobile = w <= 576;
    const top = mobile ? 30 : 80;
    const bottom = mobile ? 350 : hero.offsetHeight - 200;
    let zoneW, sx;
    if (mobile) {
      zoneW = w;
      sx = 0;
    } else {
      zoneW = 250;
      if (ci === 0) sx = 50;
      else if (ci === 1) sx = w - 300;
      else sx = (w - zoneW) / 2;
    }
    return { top, bottom, zoneW, sx };
  }

  comets.forEach((el, ci) => {
    const startFromTop = ci % 2 === 0;
    const z0 = getZone(ci);

    const pos = { x: z0.sx + Math.random() * z0.zoneW, y: startFromTop ? z0.top : z0.bottom };
    let prevX = pos.x;
    let prevY = pos.y;
    let goingDown = startFromTop;
    const speed = 120 + Math.random() * 100;

    gsap.set(el, { left: pos.x, top: pos.y });

    function fly() {
      const z = getZone(ci);
      const nextX = z.sx + Math.random() * z.zoneW;
      const nextY = goingDown ? z.bottom + Math.random() * 40 - 20 : z.top + Math.random() * 40 - 20;
      goingDown = !goingDown;

      const dist = Math.hypot(nextX - pos.x, nextY - pos.y);
      const dur = dist / speed;

      gsap.to(pos, {
        x: nextX,
        y: nextY,
        duration: dur,
        ease: "none",
        onUpdate() {
          const dx = pos.x - prevX;
          const dy = pos.y - prevY;
          if (Math.abs(dx) > 0.3 || Math.abs(dy) > 0.3) {
            const angle = Math.atan2(dy, dx) * (180 / Math.PI) - 90;
            gsap.set(el, { rotation: angle });
          }
          gsap.set(el, { left: pos.x, top: pos.y });
          prevX = pos.x;
          prevY = pos.y;
        },
        onComplete: fly,
      });
    }

    fly();
  });
}

// Hero title & subtitle — text shadow glow pulse
gsap.fromTo(".hero-title",
  { textShadow: "0 0 10px rgba(255, 229, 7, 0), 0 0 30px rgba(255, 153, 0, 0)" },
  { textShadow: "0 0 20px rgba(255, 229, 7, 0.5), 0 0 50px rgba(255, 153, 0, 0.3)", duration: 2, ease: "sine.inOut", repeat: -1, yoyo: true },
);

gsap.fromTo(".hero-subtitle",
  { textShadow: "0 0 10px rgba(255, 229, 7, 0), 0 0 30px rgba(255, 153, 0, 0)" },
  { textShadow: "0 0 15px rgba(255, 229, 7, 0.35), 0 0 40px rgba(255, 153, 0, 0.2)", duration: 2.5, ease: "sine.inOut", repeat: -1, yoyo: true, delay: 0.5 },
);

// Steps highlight — sliding overlay
const stepsWrapper = document.querySelector(".steps-wrapper");
const steps = document.querySelectorAll(".step-wrapper-item");

if (stepsWrapper && steps.length) {
  let current = 0;
  // Create sliding overlay
  const overlay = document.createElement("span");
  overlay.className = "step-overlay";
  overlay.style.cssText =
    "position:absolute;background:#FECA00;border-radius:14px;pointer-events:none;transition:none;z-index:0;overflow:hidden";

  const overlayShimmer = document.createElement("span");
  overlayShimmer.style.cssText =
    "position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.25) 50%,transparent 100%);pointer-events:none";
  overlay.appendChild(overlayShimmer);

  gsap.fromTo(overlayShimmer,
    { left: "-100%" },
    { left: "100%", duration: 1.2, ease: "power1.inOut", repeat: -1, repeatDelay: 2 },
  );

  stepsWrapper.style.position = "relative";
  stepsWrapper.insertBefore(overlay, stepsWrapper.firstChild);

  // Ensure step content is above overlay
  steps.forEach((step) => {
    step.style.position = "relative";
    step.style.zIndex = "1";
  });

  function positionOverlay(index, animate) {
    const step = steps[index];
    const wrapperRect = stepsWrapper.getBoundingClientRect();
    const stepRect = step.getBoundingClientRect();

    const props = {
      left: stepRect.left - wrapperRect.left,
      top: stepRect.top - wrapperRect.top,
      width: stepRect.width,
      height: stepRect.height,
    };

    if (animate) {
      gsap.to(overlay, { ...props, duration: 0.6, ease: "power2.inOut" });
    } else {
      gsap.set(overlay, props);
    }
  }

  function activateStep(index) {
    const prev = current;
    const isLoop = prev === steps.length - 1 && index === 0;

    if (isLoop) {
      // Fade out on last step
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.4,
        ease: "power1.inOut",
        onComplete: () => {
          steps[prev].classList.remove("step-active");
          positionOverlay(index, false);
          steps[index].classList.add("step-active");
          // Fade in on first step
          gsap.to(overlay, { opacity: 1, duration: 0.4, ease: "power1.inOut" });
        },
      });
    } else {
      positionOverlay(index, true);
      setTimeout(() => {
        steps[prev].classList.remove("step-active");
        steps[index].classList.add("step-active");
      }, 300);
    }

    current = index;
  }

  // Initial position + recalc after content loads
  positionOverlay(0, false);
  window.addEventListener("load", () => positionOverlay(current, false));

  function stepCycle() {
    activateStep((current + 1) % steps.length);
    setTimeout(stepCycle, 2500);
  }
  setTimeout(stepCycle, 2500);

  // Reposition on resize
  window.addEventListener("resize", () => positionOverlay(current, false));
}

// CTA buttons shimmer
document.querySelectorAll(".form-step-btn").forEach((btn) => {
  btn.style.position = "relative";
  btn.style.overflow = "hidden";

  const shimmer = document.createElement("span");
  shimmer.style.cssText =
    "position:absolute;top:0;left:-100%;width:150%;height:100%;background:linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.7) 45%,rgba(255,255,255,0.9) 50%,rgba(255,255,255,0.7) 55%,transparent 100%);pointer-events:none";
  btn.appendChild(shimmer);

  gsap.fromTo(shimmer,
    { left: "-100%" },
    { left: "100%", duration: 1, ease: "power1.inOut", repeat: -1, repeatDelay: 2.5 },
  );
});

