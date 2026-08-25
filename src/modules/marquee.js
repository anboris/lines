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
  const marqueeTrack = document.querySelector(".marquee-track");
  if (!marqueeTrack) return;

  // Apply random styles to the original set of cards
  applyCardStyles();

  // Duplicate the content for a seamless CSS infinite loop.
  // Because the CSS animation moves exactly -50%, having two identical
  // sets of cards creates a perfect, unnoticeable reset point.
  const originalCards = Array.from(marqueeTrack.children);
  originalCards.forEach((node) => {
    marqueeTrack.appendChild(node.cloneNode(true));
  });
}
