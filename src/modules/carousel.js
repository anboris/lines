export function initCarousel() {
  const track = document.getElementById("carouselTrack");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  if (!track) return;

  const getItemWidth = () => {
    const card = track.querySelector(".carousel-card");
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    return card.offsetWidth + gap;
  };

  // 1. Центрируем первую карточку при загрузке
  const setInitialPosition = () => {
    const card = track.querySelector(".carousel-card");
    if (!card) return;
    const cardWidth = card.offsetWidth;
    const containerWidth = track.clientWidth;
    const spacerWidth = (containerWidth - cardWidth) / 2;

    track.style.scrollBehavior = "auto";
    track.scrollLeft = spacerWidth;
    track.style.scrollBehavior = "smooth";
  };
  requestAnimationFrame(setInitialPosition);

  // 2. Управление перевёрнутыми карточками
  let currentlyFlippedCard = null;

  const closeFlippedCard = () => {
    if (currentlyFlippedCard) {
      currentlyFlippedCard.classList.remove("is-flipped");
      currentlyFlippedCard = null;
    }
  };

  // 3. Навигация стрелками
  nextBtn?.addEventListener("click", () => {
    closeFlippedCard();
    track.scrollBy({ left: getItemWidth(), behavior: "smooth" });
  });

  prevBtn?.addEventListener("click", () => {
    closeFlippedCard();
    track.scrollBy({ left: -getItemWidth(), behavior: "smooth" });
  });

  // 4. Закрытие при скролле
  track.addEventListener("scroll", closeFlippedCard, { passive: true });

  // 5. Делегирование событий для переворота
  track.addEventListener("click", (e) => {
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

    const closeBtn = e.target.closest(".carousel-card-back-close");
    if (closeBtn) {
      e.stopPropagation();
      closeFlippedCard();
      return;
    }
  });
}
