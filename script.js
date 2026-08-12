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
