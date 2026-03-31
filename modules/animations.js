import gsap from "gsap";

gsap.to(".preloader", { opacity: 0, duration: 0.25, delay: 0.5 });

// Chicken float
gsap.to(".chicken-img", {
  y: 15,
  duration: 1.5,
  ease: "sine.inOut",
  repeat: -1,
  yoyo: true,
});


// Fire flicker
gsap.to(".fire-left", {
  opacity: 0.6,
  scaleY: 1.03,
  duration: 0.8,
  ease: "sine.inOut",
  repeat: -1,
  yoyo: true,
  transformOrigin: "bottom center",
});

gsap.to(".fire-right", {
  opacity: 0.55,
  scaleY: 1.04,
  duration: 1,
  ease: "sine.inOut",
  repeat: -1,
  yoyo: true,
  delay: 0.3,
  transformOrigin: "bottom center",
});

// Coins shimmer
gsap.fromTo(".coins-left",
  { y: 0, filter: "brightness(1)" },
  { y: -5, filter: "brightness(1.3)", duration: 2, ease: "sine.inOut", repeat: -1, yoyo: true },
);

gsap.fromTo(".coins-right",
  { y: 0, filter: "brightness(1)" },
  { y: -4, filter: "brightness(1.25)", duration: 2.4, ease: "sine.inOut", repeat: -1, yoyo: true, delay: 0.5 },
);

// Hero title & subtitle — text shadow glow pulse
gsap.fromTo(".hero-title",
  { textShadow: "0 0 10px rgba(255, 229, 7, 0), 0 0 30px rgba(255, 153, 0, 0)" },
  { textShadow: "0 0 20px rgba(255, 229, 7, 0.5), 0 0 50px rgba(255, 153, 0, 0.3)", duration: 2, ease: "sine.inOut", repeat: -1, yoyo: true },
);

gsap.fromTo(".hero-subtitle",
  { textShadow: "0 0 10px rgba(255, 229, 7, 0), 0 0 30px rgba(255, 153, 0, 0)" },
  { textShadow: "0 0 15px rgba(255, 229, 7, 0.35), 0 0 40px rgba(255, 153, 0, 0.2)", duration: 2.5, ease: "sine.inOut", repeat: -1, yoyo: true, delay: 0.5 },
);

// Falling feathers
const heroSection = document.querySelector("#hero");
if (heroSection) {
  const CDN = "https://3344112-img.b-cdn.net/graphic/landings/сhickenroannew";
  const featherSrcs = [`${CDN}/feather-1.webp`, `${CDN}/feather-2.webp`];

  function spawnFeather() {
    const img = document.createElement("img");
    img.src = featherSrcs[Math.floor(Math.random() * featherSrcs.length)];
    img.style.cssText =
      "position:absolute;pointer-events:none;z-index:1;opacity:0";

    const size = 30 + Math.random() * 50;
    img.style.width = size + "px";
    img.style.height = size + "px";
    img.style.left = Math.random() * 100 + "%";
    img.style.top = "-80px";

    heroSection.appendChild(img);

    const duration = 4 + Math.random() * 4;
    const drift = -60 + Math.random() * 120;
    const rotation = Math.random() * 360 + (-180 + Math.random() * 360);
    const fallDist = heroSection.offsetHeight + 100;

    const tl = gsap.timeline({ onComplete: () => img.remove() });
    tl.to(img, { opacity: 0.7, duration: 0.5 })
      .to(img, { y: fallDist, x: drift, rotation, duration, ease: "sine.inOut" }, 0)
      .to(img, { opacity: 0, duration: 1 }, duration - 1);
  }

  // Spawn initial batch
  for (let i = 0; i < 15; i++) {
    setTimeout(spawnFeather, i * 300);
  }

  // Keep ~15-20 on screen
  function featherLoop() {
    spawnFeather();
    setTimeout(featherLoop, 400 + Math.random() * 600);
  }
  setTimeout(featherLoop, 4500);
}

// Steps highlight — sliding overlay
const stepsWrapper = document.querySelector(".steps-wrapper");
const steps = document.querySelectorAll(".step-wrapper-item");

if (stepsWrapper && steps.length) {
  let current = 0;
  // Create sliding overlay
  const overlay = document.createElement("span");
  overlay.className = "step-overlay";
  overlay.style.cssText =
    "position:absolute;background:linear-gradient(180deg, #FFE507 0%, #F90 100%);border-radius:14px;pointer-events:none;transition:none;z-index:0;overflow:hidden";

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

