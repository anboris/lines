// marquee-styles.js

const variants = [
  "card-sand",
  "card-stone",
  "card-charcoal",
  "card-coral-light",
  "card-mint-light",
  "card-forest",
];

const patterns = [
  "pattern-diagonal-left",
  "pattern-diagonal-right",
  "pattern-waves",
];

// Inject CSS rules directly via JS to avoid unreferenced CSS in static style sheets
function injectMarqueeStyles() {
  if (document.getElementById("marquee-dynamic-styles")) return;

  const style = document.createElement("style");
  style.id = "marquee-dynamic-styles";
  style.textContent = `
    /* Palette Variants */
    .text-card.card-sand {
      background-color: #f2ede3;
      color: #191e25;
      border: 0px solid #d6d0c2;
    }
    .text-card.card-stone {
      background-color: #b1a18c;
      color: #191e25;
      border: 0px solid #d6d0c2;
    }
    .text-card.card-charcoal {
      background-color: #191e25;
      color: #f2ede3;
      border: 0px solid #d2d6d7;
    }
    .text-card.card-coral-light {
      background-color: #ff6862;
      color: #191e25;
      border: 0px solid #ec4a3b;
    }
    .text-card.card-mint-light {
      background-color: #bddcc6;
      color: #191e25;
      border: 0px solid #99c9af;
    }
    .text-card.card-forest {
      background-color: #4e936f;
      color: #f2ede3;
      border: 0px solid #659d80;
    }

    /* Base Pattern Setup */
    .text-card {
      position: relative;
      background-repeat: repeat;
    }

    /* Pattern 1: Diagonal Right Stripes (45deg) */
    .text-card.pattern-diagonal-right {
      background-image: repeating-linear-gradient(
        45deg,
        transparent,
        transparent 14px,
        rgba(255, 255, 255, 0.08) 14px,
        rgba(255, 255, 255, 0.08) 16px
      );
    }
    .text-card.card-sand.pattern-diagonal-right,
    .text-card.card-stone.pattern-diagonal-right,
    .text-card.card-coral-light.pattern-diagonal-right,
    .text-card.card-mint-light.pattern-diagonal-right {
      background-image: repeating-linear-gradient(
        45deg,
        transparent,
        transparent 14px,
        rgba(25, 30, 37, 0.05) 14px,
        rgba(25, 30, 37, 0.05) 16px
      );
    }

    /* Pattern 2: Reverse Diagonal Left Stripes (-45deg) */
    .text-card.pattern-diagonal-left {
      background-image: repeating-linear-gradient(
        -45deg,
        transparent,
        transparent 14px,
        rgba(255, 255, 255, 0.08) 14px,
        rgba(255, 255, 255, 0.08) 16px
      );
    }
    .text-card.card-sand.pattern-diagonal-left,
    .text-card.card-stone.pattern-diagonal-left,
    .text-card.card-coral-light.pattern-diagonal-left,
    .text-card.card-mint-light.pattern-diagonal-left {
      background-image: repeating-linear-gradient(
        -45deg,
        transparent,
        transparent 14px,
        rgba(25, 30, 37, 0.05) 14px,
        rgba(25, 30, 37, 0.05) 16px
      );
    }

    /* Pattern 3: Organic Line Waves */
    .text-card.pattern-waves {
      background-image: repeating-radial-gradient(
        circle at 100% 100%,
        transparent,
        transparent 12px,
        rgba(255, 255, 255, 0.07) 12px,
        rgba(255, 255, 255, 0.07) 14px
      );
    }
    .text-card.card-sand.pattern-waves,
    .text-card.card-stone.pattern-waves,
    .text-card.card-coral-light.pattern-waves,
    .text-card.card-mint-light.pattern-waves {
      background-image: repeating-radial-gradient(
        circle at 100% 100%,
        transparent,
        transparent 12px,
        rgba(25, 30, 37, 0.05) 12px,
        rgba(25, 30, 37, 0.05) 14px
      );
    }
  `;
  document.head.appendChild(style);
}

function applyCardStyles() {
  const cards = document.querySelectorAll(".bento-square.text-card");
  let lastVariant = null;

  cards.forEach((card) => {
    const availableVariants = variants.filter((v) => v !== lastVariant);
    const chosenVariant =
      availableVariants[Math.floor(Math.random() * availableVariants.length)];
    const chosenPattern = patterns[Math.floor(Math.random() * patterns.length)];

    card.classList.remove(...variants, ...patterns);
    card.classList.add(chosenVariant, chosenPattern);

    lastVariant = chosenVariant;
  });
}

function initMarquee() {
  injectMarqueeStyles();

  const track = document.querySelector(".marquee-track");
  if (!track) return;

  // Style the primary set of cards
  applyCardStyles();

  // Duplicate the first set to ensure a seamless infinite marquee loop
  const originalCards = Array.from(track.children);
  originalCards.forEach((node) => {
    track.appendChild(node.cloneNode(true));
  });
}

document.addEventListener("DOMContentLoaded", initMarquee);
