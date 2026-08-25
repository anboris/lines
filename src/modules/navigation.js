export function initNavigation() {
  const navTrack = document.getElementById("navTrack");
  const navItems = document.querySelectorAll(".nav-item");
  const sections = document.querySelectorAll("section[id]"); // Only observe sections with IDs

  if (!navTrack || navItems.length === 0 || sections.length === 0) return;

  function ensureVisibleOnMobile(item) {
    if (window.innerWidth >= 768) return;

    const trackRect = navTrack.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const buffer = 20;

    const isOffLeft = itemRect.left < trackRect.left + buffer;
    const isOffRight = itemRect.right > trackRect.right - buffer;

    if (isOffLeft || isOffRight) {
      const scrollOffset =
        itemRect.left -
        trackRect.left -
        trackRect.width / 2 +
        itemRect.width / 2;
      navTrack.scrollBy({ left: scrollOffset, behavior: "smooth" });
    }
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          if (!id) return;

          navItems.forEach((item) => {
            if (item.dataset.section === id) {
              item.classList.add("active");
              ensureVisibleOnMobile(item);
            } else {
              item.classList.remove("active");
            }
          });
        }
      });
    },
    { rootMargin: "-40% 0px -40% 0px", threshold: 0 },
  );

  sections.forEach((section) => observer.observe(section));
}
