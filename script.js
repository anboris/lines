(function () {
  const track = document.getElementById("carouselTrack");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const dotsContainer = document.getElementById("paginationDots");
  const cards = track.querySelectorAll(".card");
  const totalCards = cards.length;

  let currentIndex = 0;
  const cardsPerView = 3.5;
  const maxIndex = totalCards - Math.floor(cardsPerView);

  for (let i = 0; i <= maxIndex; i++) {
    const dot = document.createElement("button");
    dot.className = "dot" + (i === 0 ? " active" : "");
    dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
    dot.addEventListener("click", () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }
  const dots = dotsContainer.querySelectorAll(".dot");

  function updateCarousel() {
    const cardWidth = cards[0].offsetWidth;
    const gap = parseFloat(getComputedStyle(track).gap) || 20;
    const offset = currentIndex * (cardWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;

    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= maxIndex;

    dots.forEach((dot, i) =>
      dot.classList.toggle("active", i === currentIndex),
    );
  }

  function goToSlide(index) {
    currentIndex = Math.max(0, Math.min(index, maxIndex));
    updateCarousel();
  }

  prevBtn.addEventListener("click", () => goToSlide(currentIndex - 1));
  nextBtn.addEventListener("click", () => goToSlide(currentIndex + 1));

  let isDown = false,
    startX;
  track.addEventListener("mousedown", (e) => {
    isDown = true;
    startX = e.pageX;
  });
  track.addEventListener("mouseleave", () => {
    isDown = false;
  });
  track.addEventListener("mouseup", (e) => {
    if (!isDown) return;
    isDown = false;
    const diff = startX - e.pageX;
    if (Math.abs(diff) > 50) goToSlide(currentIndex + (diff > 0 ? 1 : -1));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") goToSlide(currentIndex - 1);
    if (e.key === "ArrowRight") goToSlide(currentIndex + 1);
  });

  window.addEventListener("resize", updateCarousel);
  updateCarousel();
})();

// Smart navbar: hide on scroll down, show on scroll up
(function () {
  const header = document.getElementById("siteHeader");
  let lastScroll = 0;
  let ticking = false;

  function updateHeader() {
    const currentScroll = window.scrollY;

    // Toggle scrolled class for background change
    header.classList.toggle("scrolled", currentScroll > 50);

    // Hide when scrolling down, show when scrolling up
    if (currentScroll > lastScroll && currentScroll > 100) {
      header.classList.add("hidden");
    } else {
      header.classList.remove("hidden");
    }

    lastScroll = currentScroll;
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    },
    { passive: true },
  );
})();

// ===== PRICING TABS =====
document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".pricing-tab");
  const panes = {
    single: document.getElementById("pane-single"),
    individual: document.getElementById("pane-individual"),
    group: document.getElementById("pane-group"),
  };

  function activatePane(paneId) {
    // Deactivate all panes
    Object.values(panes).forEach((pane) => pane.classList.remove("active"));
    // Deactivate all tabs
    tabs.forEach((tab) => {
      tab.classList.remove("active");
      tab.setAttribute("aria-selected", "false");
    });

    // Activate target pane
    const target = document.getElementById(paneId);
    if (target) target.classList.add("active");

    // Activate matching tab
    const matchingTab = document.querySelector(
      `.pricing-tab[data-pane="${paneId}"]`,
    );
    if (matchingTab) {
      matchingTab.classList.add("active");
      matchingTab.setAttribute("aria-selected", "true");
    }
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const paneId = tab.dataset.pane;
      if (paneId) activatePane(paneId);
    });
  });

  // (Optional) set default from URL hash
  const hash = window.location.hash.replace("#", "");
  if (hash && panes[hash]) activatePane(hash);
});

// ===== SUB-TABS (Individual pane) =====
document.querySelectorAll(".sub-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    const parent = tab.closest(".pricing-pane");
    const targetId = tab.dataset.subpane;

    // Deactivate all sub-tabs in this pane
    parent.querySelectorAll(".sub-tab").forEach((t) => {
      t.classList.remove("active");
      t.setAttribute("aria-selected", "false");
    });

    // Activate clicked sub-tab
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");

    // Deactivate all sub-panes in this pane
    parent.querySelectorAll(".sub-pane").forEach((pane) => {
      pane.classList.remove("active");
    });

    // Activate target sub-pane
    const targetPane = document.getElementById(targetId);
    if (targetPane) targetPane.classList.add("active");
  });
});

function updatePrice(selectElement, cardPrefix) {
  // Get selected option values
  const totalPrice =
    parseInt(selectElement.value).toLocaleString("ru-RU") + " ₽";
  const selectedOption = selectElement.options[selectElement.selectedIndex];
  const perClassValue = selectedOption.getAttribute("data-per-class");

  // Format per-class subtitle text
  const perClassText =
    perClassValue === "Без лимита"
      ? "Безлимитные посещения"
      : `${parseInt(perClassValue).toLocaleString("ru-RU")} ₽ / занятие`;

  // Apply real-time DOM updates
  document.getElementById(`${cardPrefix}-price`).innerText = totalPrice;
  document.getElementById(`${cardPrefix}-per-class`).innerText = perClassText;
}
