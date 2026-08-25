// src/modules/marquee.js

const VARIANTS = [
  "card-sand",
  "card-stone",
  "card-charcoal",
  "card-coral-light",
  "card-mint-light",
  "card-forest",
];

const PATTERNS = [
  "pattern-diagonal-left",
  "pattern-diagonal-right",
  "pattern-waves",
];

function applyCardStyles() {
  const cards = document.querySelectorAll(".bento-square.text-card");
  let lastVariant = null;

  cards.forEach((card) => {
    const availableVariants = VARIANTS.filter((v) => v !== lastVariant);
    const chosenVariant =
      availableVariants[Math.floor(Math.random() * availableVariants.length)];
    const chosenPattern = PATTERNS[Math.floor(Math.random() * PATTERNS.length)];

    card.classList.remove(...VARIANTS, ...PATTERNS);
    card.classList.add(chosenVariant, chosenPattern);
    lastVariant = chosenVariant;
  });
}

export function initMarquee() {
  const track = document.querySelector(".marquee-track");

  // Select marquee-specific arrows (to avoid conflict with carousel arrows)
  const prevBtn = document.getElementById("marqueePrevBtn");
  const nextBtn = document.getElementById("marqueeNextBtn");

  if (!track) return;

  // 1. Apply random styles to original cards
  applyCardStyles();

  // 2. Clone cards to create 3 identical sets (Set 1, Set 2, Set 3)
  const originalCards = Array.from(track.children);
  for (let i = 0; i < 2; i++) {
    originalCards.forEach((card) => track.appendChild(card.cloneNode(true)));
  }

  // 3. Dimension calculations
  const getItemWidth = () => {
    const card = track.querySelector(".bento-square");
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    return card.offsetWidth + gap;
  };

  let setWidth = originalCards.length * getItemWidth();

  // CRITICAL: Update width on resize so the reset math stays accurate
  window.addEventListener("resize", () => {
    setWidth = originalCards.length * getItemWidth();
  });

  // 4. Start in the middle set (Set 2)
  const setInitialPosition = () => {
    track.style.scrollBehavior = "auto";
    track.scrollLeft = setWidth;
    track.style.scrollBehavior = "smooth";
  };
  requestAnimationFrame(setInitialPosition);

  // 5. Auto-scroll engine
  let animationId;
  let isPaused = false;
  let resumeTimeout;
  const speed = 1; // Pixels per frame

  const autoScroll = () => {
    if (!isPaused) {
      track.scrollLeft += speed;

      // Seamless reset: jump back to start of Set 2 when reaching the end of it
      if (track.scrollLeft >= setWidth * 2 - 1) {
        track.style.scrollBehavior = "auto"; // Instant jump, no tweening
        track.scrollLeft -= setWidth;
        track.style.scrollBehavior = "smooth"; // Restore smooth for user interactions
      }
    }
    animationId = requestAnimationFrame(autoScroll);
  };

  // 6. Interaction handlers
  const pause = () => {
    isPaused = true;
    clearTimeout(resumeTimeout);
  };

  const resume = () => {
    clearTimeout(resumeTimeout);
    // Delay resume to let native momentum/smooth scroll finish naturally
    resumeTimeout = setTimeout(() => {
      isPaused = false;
    }, 300);
  };

  track.addEventListener("mouseenter", pause);
  track.addEventListener("mouseleave", resume);
  track.addEventListener("touchstart", pause, { passive: true });
  track.addEventListener("touchend", resume, { passive: true });

  track.addEventListener(
    "wheel",
    () => {
      pause();
      resume();
    },
    { passive: true },
  );

  // 7. Arrow Navigation (NEW)
  // We MUST pause before scrolling, otherwise the rAF loop fights the smooth scroll
  nextBtn?.addEventListener("click", () => {
    pause();
    track.scrollBy({ left: getItemWidth(), behavior: "smooth" });
    resume();
  });

  prevBtn?.addEventListener("click", () => {
    pause();
    track.scrollBy({ left: -getItemWidth(), behavior: "smooth" });
    resume();
  });

  // Start the engine
  animationId = requestAnimationFrame(autoScroll);
}
