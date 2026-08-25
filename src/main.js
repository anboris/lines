import { initCarousel } from "./modules/carousel.js";
import { initMarquee } from "./modules/marquee.js";
import { initNavigation } from "./modules/navigation.js";

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initMarquee();
  initCarousel();
});
