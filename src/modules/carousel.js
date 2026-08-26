export function initCarousel() {
  const track = document.getElementById("carouselTrack");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  if (!track) return;

  // 1. Clone cards 3x for "infinite" feel
  const cards = Array.from(track.children);
  for (let i = 0; i < 2; i++) {
    cards.forEach((card) => track.appendChild(card.cloneNode(true)));
  }

  const getItemWidth = () => {
    const card = track.querySelector(".carousel-card");
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    return card.offsetWidth + gap;
  };

  // 2. State management for flipped cards
  let currentlyFlippedCard = null;

  const closeFlippedCard = () => {
    if (currentlyFlippedCard) {
      currentlyFlippedCard.classList.remove("is-flipped");
      currentlyFlippedCard = null;
    }
  };

  // 3. Arrow navigation (closes any flipped card first)
  nextBtn?.addEventListener("click", () => {
    closeFlippedCard();
    track.scrollBy({ left: getItemWidth(), behavior: "smooth" });
  });

  prevBtn?.addEventListener("click", () => {
    closeFlippedCard();
    track.scrollBy({ left: -getItemWidth(), behavior: "smooth" });
  });

  // 4. Close on swipe, wheel, or any scroll interaction
  track.addEventListener(
    "scroll",
    () => {
      closeFlippedCard();
    },
    { passive: true },
  );

  // 5. Event delegation for flip interactions
  track.addEventListener("click", (e) => {
    // Handle "+" button click
    const flipBtn = e.target.closest(".carousel-card-btn");
    if (flipBtn) {
      e.stopPropagation();
      const card = flipBtn.closest(".carousel-card");

      // If clicking the SAME card that is already flipped, just close it
      if (currentlyFlippedCard === card) {
        closeFlippedCard();
      } else {
        // Close any previously flipped card
        closeFlippedCard();
        // Flip the new one
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
