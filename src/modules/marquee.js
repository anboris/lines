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
  const prevBtn = document.getElementById("marqueePrevBtn");
  const nextBtn = document.getElementById("marqueeNextBtn");

  if (!track) return;

  // 1. Применяем случайные стили к оригинальным карточкам
  applyCardStyles();

  // 2. Клонируем карточки 3 раза для "бесконечного" эффекта
  const originalCards = Array.from(track.children);
  for (let i = 0; i < 2; i++) {
    originalCards.forEach((card) => track.appendChild(card.cloneNode(true)));
  }

  const getItemWidth = () => {
    const card = track.querySelector(".bento-square");
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    return card.offsetWidth + gap;
  };

  // 3. Начинаем со среднего набора (Set 2)
  const setInitialPosition = () => {
    const setWidth = originalCards.length * getItemWidth();
    track.style.scrollBehavior = "auto";
    track.scrollLeft = setWidth;
    track.style.scrollBehavior = "smooth";
  };
  requestAnimationFrame(setInitialPosition);

  // ==========================================
  // 4. PING-PONG АВТО-СКРОЛЛ ПРИ БЕЗДЕЙСТВИИ
  // ==========================================

  let autoScrollInterval = null;
  let idleTimeout = null;
  let direction = 1; // 1 = вперёд, -1 = назад

  const IDLE_DELAY = 0o0;
  const SCROLL_INTERVAL = 3000;

  const checkBounds = () => {
    const maxScroll = track.scrollWidth - track.clientWidth;
    const currentScroll = track.scrollLeft;

    // Если достигли конца — меняем направление назад
    if (currentScroll >= maxScroll - 10) {
      direction = -1;
    }
    // Если достигли начала — меняем направление вперёд
    else if (currentScroll <= 10) {
      direction = 1;
    }
  };

  const startAutoScroll = () => {
    stopAutoScroll();
    autoScrollInterval = setInterval(() => {
      checkBounds(); // Проверяем границы перед каждым скроллом
      track.scrollBy({ left: getItemWidth() * direction, behavior: "smooth" });
    }, SCROLL_INTERVAL);
  };

  const stopAutoScroll = () => {
    if (autoScrollInterval) {
      clearInterval(autoScrollInterval);
      autoScrollInterval = null;
    }
  };

  const resetIdleTimer = () => {
    stopAutoScroll();
    clearTimeout(idleTimeout);
    idleTimeout = setTimeout(startAutoScroll, IDLE_DELAY);
  };

  // Сбрасываем таймер при любом взаимодействии
  track.addEventListener("scroll", resetIdleTimer, { passive: true });
  track.addEventListener("mouseenter", stopAutoScroll);
  track.addEventListener("mouseleave", resetIdleTimer);

  // 5. Навигация стрелками
  nextBtn?.addEventListener("click", () => {
    resetIdleTimer();
    track.scrollBy({ left: getItemWidth(), behavior: "smooth" });
  });

  prevBtn?.addEventListener("click", () => {
    resetIdleTimer();
    track.scrollBy({ left: -getItemWidth(), behavior: "smooth" });
  });

  // Запускаем таймер бездействия при инициализации
  resetIdleTimer();
}
