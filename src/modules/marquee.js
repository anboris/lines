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
  // 4. ЛОГИКА "УМНОГО" АВТО-СКРОЛЛА ПРИ БЕЗДЕЙСТВИИ
  // ==========================================

  let autoScrollInterval = null;
  let idleTimeout = null;

  const IDLE_DELAY = 1000; // 3 секунды бездействия перед запуском
  const SCROLL_INTERVAL = 4000; // Скроллить каждые 4 секунды

  const startAutoScroll = () => {
    stopAutoScroll(); // На всякий случай очищаем предыдущий
    autoScrollInterval = setInterval(() => {
      // Эмулируем клик по кнопке "вперёд" или свайп
      track.scrollBy({ left: getItemWidth(), behavior: "smooth" });
    }, SCROLL_INTERVAL);
  };

  const stopAutoScroll = () => {
    if (autoScrollInterval) {
      clearInterval(autoScrollInterval);
      autoScrollInterval = null;
    }
  };

  const resetIdleTimer = () => {
    stopAutoScroll(); // Останавливаем авто-скролл при любом действии
    clearTimeout(idleTimeout);
    // Перезапускаем таймер бездействия
    idleTimeout = setTimeout(startAutoScroll, IDLE_DELAY);
  };

  // Сбрасываем таймер при свайпе, колёсике мыши или любом скролле
  track.addEventListener("scroll", resetIdleTimer, { passive: true });

  // Дополнительно: останавливаем, если мышь наведена на маркер (хороший UX для десктопа)
  track.addEventListener("mouseenter", stopAutoScroll);
  track.addEventListener("mouseleave", resetIdleTimer);

  // 5. Навигация стрелками (также сбрасывает таймер)
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
