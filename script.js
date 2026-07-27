const header = document.querySelector(".site-header");
const hero = document.querySelector("#hero");

let lastScroll = 0;
let isHeroVisible = true;

// IntersectionObserver to detect when hero leaves the viewport
const heroObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      isHeroVisible = entry.isIntersecting;

      // Toggle scrolled class based on hero visibility
      header.classList.toggle("scrolled", !isHeroVisible);

      // Always show header when hero is visible
      if (isHeroVisible) {
        header.classList.remove("hidden");
      }
    });
  },
  {
    // Trigger when hero is almost out of view
    rootMargin: "-80px 0px 0px 0px",
    threshold: 0,
  },
);

heroObserver.observe(hero);

// Scroll direction detection
window.addEventListener(
  "scroll",
  () => {
    const current = window.scrollY;

    // Don't hide header if hero is visible or near the top
    if (isHeroVisible || current < 80) {
      header.classList.remove("hidden");
      lastScroll = current;
      return;
    }

    // Hide while scrolling down
    if (current > lastScroll && current > 180) {
      header.classList.add("hidden");
    } else {
      header.classList.remove("hidden");
    }

    lastScroll = current;
  },
  { passive: true },
);
