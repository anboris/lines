export function initCarousel() {
  const track = document.getElementById("carouselTrack");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  if (!track) return;

  // 1. Clone cards 3x for "infinite" feel
  const originalCards = Array.from(track.children);
  for (let i = 0; i < 2; i++) {
    originalCards.forEach((card) => track.appendChild(card.cloneNode(true)));
  }

  const getItemWidth = () => {
    const card = track.querySelector(".carousel-card");
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    return card.offsetWidth + gap;
  };

  // 2. Start in the middle set (Set 2) for perfect initial centering
  const setInitialPosition = () => {
    const setWidth = originalCards.length * getItemWidth();
    track.style.scrollBehavior = "auto"; // Мгновенный прыжок без анимации
    track.scrollLeft = setWidth; // Прыгаем ровно на начало среднего набора
    track.style.scrollBehavior = "smooth"; // Возвращаем плавность для будущих взаимодействий
  };
  requestAnimationFrame(setInitialPosition);

  // 3. State management for flipped cards
  let currentlyFlippedCard = null;

  const closeFlippedCard = () => {
    if (currentlyFlippedCard) {
      currentlyFlippedCard.classList.remove("is-flipped");
      currentlyFlippedCard = null;
    }
  };

  // 4. Arrow navigation (closes any flipped card first)
  nextBtn?.addEventListener("click", () => {
    closeFlippedCard();
    track.scrollBy({ left: getItemWidth(), behavior: "smooth" });
  });

  prevBtn?.addEventListener("click", () => {
    closeFlippedCard();
    track.scrollBy({ left: -getItemWidth(), behavior: "smooth" });
  });

  // 5. Close on swipe, wheel, or any scroll interaction
  track.addEventListener(
    "scroll",
    () => {
      closeFlippedCard();
    },
    { passive: true },
  );

  // 6. Event delegation for flip interactions
  track.addEventListener("click", (e) => {
    // Handle "+" button click
    const flipBtn = e.target.closest(".carousel-card-btn");
    if (flipBtn) {
      e.stopPropagation();
      const card = flipBtn.closest(".carousel-card");

      if (currentlyFlippedCard === card) {
        closeFlippedCard();
      } else {
        closeFlippedCard();
        card.classList.add("is-flipped");
        currentlyFlippedCard = card;
      }
      return;
    }

    // Handle "X" close button click
    const closeBtn = e.target.closest(".carousel-card-back-close");
    if (closeBtn) {
      e.stopPropagation();
      closeFlippedCard();
      return;
    }
  });
}
