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

  applyCardStyles();

  const getItemWidth = () => {
    const card = track.querySelector(".bento-square");
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    return card.offsetWidth + gap;
  };

  // Центрируем ТРЕТЬЮ карточку при загрузке
  const setInitialPosition = () => {
    const card = track.querySelector(".bento-square");
    if (!card) return;
    const spacerWidth = (track.clientWidth - card.offsetWidth) / 2;
    const itemWidth = getItemWidth();

    track.style.scrollBehavior = "auto";
    // Прокручиваем на 2 карточки вправо, чтобы 3-я оказалась по центру
    track.scrollLeft = spacerWidth + itemWidth * 1;
    track.style.scrollBehavior = "smooth";
  };
  requestAnimationFrame(setInitialPosition);

  // Навигация стрелками
  nextBtn?.addEventListener("click", () => {
    track.scrollBy({ left: getItemWidth(), behavior: "smooth" });
  });

  prevBtn?.addEventListener("click", () => {
    track.scrollBy({ left: -getItemWidth(), behavior: "smooth" });
  });
}
